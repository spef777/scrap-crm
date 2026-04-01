import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const supplierId = searchParams.get("supplierId");

  const activities = await prisma.activity.findMany({
    where: supplierId ? { supplierId } : {},
    orderBy: { date: "desc" },
    include: { supplier: { select: { name: true, phone: true } } },
  });

  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const activity = await prisma.activity.create({
    data: {
      supplierId: data.supplierId,
      userId: session.user.id!,
      remarks: data.remarks,
      outcome: data.outcome,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      date: data.date ? new Date(data.date) : new Date(),
    },
  });

  // Update supplier's nextFollowUp and stage
  const updates: any = {};
  if (data.followUpDate) updates.nextFollowUp = new Date(data.followUpDate);
  if (data.stage) updates.stage = data.stage;
  if (Object.keys(updates).length > 0) {
    await prisma.supplier.update({ where: { id: data.supplierId }, data: updates });
  }

  return NextResponse.json(activity, { status: 201 });
}
