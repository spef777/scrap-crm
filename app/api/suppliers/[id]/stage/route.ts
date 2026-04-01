import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stage } = await req.json();
  const supplier = await prisma.supplier.update({
    where: { id: params.id },
    data: { stage },
  });
  return NextResponse.json(supplier);
}
