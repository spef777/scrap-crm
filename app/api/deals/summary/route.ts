import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const weekStart = new Date(now); weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayDeals, weekDeals, monthDeals, allDeals] = await Promise.all([
    prisma.deal.findMany({ where: { date: { gte: todayStart } } }),
    prisma.deal.findMany({ where: { date: { gte: weekStart } } }),
    prisma.deal.findMany({ where: { date: { gte: monthStart } } }),
    prisma.deal.findMany({ orderBy: { date: "desc" }, take: 30, include: { supplier: { select: { name: true } } } }),
  ]);

  const sum = (deals: any[]) => ({
    count: deals.length,
    totalValue: deals.reduce((s, d) => s + d.totalValue, 0),
    totalQuantity: deals.reduce((s, d) => s + d.quantity, 0),
  });

  return NextResponse.json({
    today: sum(todayDeals),
    week: sum(weekDeals),
    month: sum(monthDeals),
    recentDeals: allDeals,
  });
}
