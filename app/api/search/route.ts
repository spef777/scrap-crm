import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = new URL(req.url).searchParams.get("q") || "";
  if (!q) return NextResponse.json([]);

  const suppliers = await prisma.supplier.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
        { location: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 10,
  });
  return NextResponse.json(suppliers);
}
