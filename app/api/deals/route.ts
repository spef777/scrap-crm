import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const supplierId = searchParams.get("supplierId");

  const deals = await prisma.deal.findMany({
    where: supplierId ? { supplierId } : {},
    orderBy: { date: "desc" },
    include: { supplier: { select: { name: true, phone: true, location: true } } },
  });

  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const totalValue = data.quantity * data.ratePerKg;

  const deal = await prisma.deal.create({
    data: {
      supplierId: data.supplierId,
      userId: session.user.id,
      date: data.date ? new Date(data.date) : new Date(),
      scrapType: data.scrapType,
      quantity: parseFloat(data.quantity),
      ratePerKg: parseFloat(data.ratePerKg),
      totalValue,
      notes: data.notes || "",
    },
  });

  // Upgrade stage to DEAL_FINALIZED if not already
  await prisma.supplier.update({
    where: { id: data.supplierId },
    data: { stage: "DEAL_FINALIZED" },
  });

  return NextResponse.json(deal, { status: 201 });
}
