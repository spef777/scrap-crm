import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: {
      activities: { orderBy: { date: "desc" } },
      deals: { orderBy: { date: "desc" } },
      _count: { select: { activities: true, deals: true } },
    },
  });

  if (!supplier) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const totalDealValue = supplier.deals.reduce((sum, d) => sum + d.totalValue, 0);
  const totalQuantity = supplier.deals.reduce((sum, d) => sum + d.quantity, 0);

  return NextResponse.json({ ...supplier, totalDealValue, totalQuantity });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const supplier = await prisma.supplier.update({
    where: { id: params.id },
    data: {
      name: data.name,
      phone: data.phone,
      location: data.location,
      scrapTypes: data.scrapTypes,
      quantity: data.quantity,
      category: data.category,
      stage: data.stage,
      tags: data.tags,
      notes: data.notes,
      nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
    },
  });

  return NextResponse.json(supplier);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.supplier.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
