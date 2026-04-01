import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const activity = await prisma.activity.update({
    where: { id: params.id },
    data: { remarks: data.remarks, outcome: data.outcome, followUpDate: data.followUpDate ? new Date(data.followUpDate) : null },
  });
  return NextResponse.json(activity);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.activity.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
