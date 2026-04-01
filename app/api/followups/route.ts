import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "today";

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999);
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);

  let where: any = { nextFollowUp: { not: null } };

  if (type === "today") where.nextFollowUp = { gte: todayStart, lte: todayEnd };
  else if (type === "overdue") where.nextFollowUp = { lt: todayStart };
  else if (type === "upcoming") where.nextFollowUp = { gt: todayEnd, lte: weekEnd };

  const suppliers = await prisma.supplier.findMany({
    where: { ...where, stage: { notIn: ["NOT_INTERESTED", "INVALID_CONTACT"] } },
    orderBy: { nextFollowUp: "asc" },
    include: { _count: { select: { activities: true } } },
  });

  return NextResponse.json({ suppliers, count: suppliers.length });
}
