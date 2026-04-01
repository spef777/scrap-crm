import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalSuppliers, todayFollowUps, overdueFollowUps,
    monthDeals, todayDeals, stageBreakdown, topSuppliers
  ] = await Promise.all([
    prisma.supplier.count(),
    prisma.supplier.count({ where: { nextFollowUp: { gte: todayStart, lte: todayEnd }, stage: { notIn: ["NOT_INTERESTED","INVALID_CONTACT"] } } }),
    prisma.supplier.count({ where: { nextFollowUp: { lt: todayStart }, stage: { notIn: ["NOT_INTERESTED","INVALID_CONTACT"] } } }),
    prisma.deal.aggregate({ where: { date: { gte: monthStart } }, _sum: { totalValue: true, quantity: true }, _count: true }),
    prisma.deal.aggregate({ where: { date: { gte: todayStart } }, _sum: { totalValue: true }, _count: true }),
    prisma.supplier.groupBy({ by: ["stage"], _count: true }),
    prisma.supplier.findMany({
      where: { deals: { some: {} } },
      include: { _count: { select: { deals: true } }, deals: { select: { totalValue: true } } },
      take: 5,
      orderBy: { deals: { _count: "desc" } },
    }),
  ]);

  const todayCallList = await prisma.supplier.findMany({
    where: { nextFollowUp: { gte: todayStart, lte: todayEnd }, stage: { notIn: ["NOT_INTERESTED","INVALID_CONTACT"] } },
    orderBy: { nextFollowUp: "asc" },
    take: 20,
  });

  const overdueList = await prisma.supplier.findMany({
    where: { nextFollowUp: { lt: todayStart }, stage: { notIn: ["NOT_INTERESTED","INVALID_CONTACT"] } },
    orderBy: { nextFollowUp: "asc" },
    take: 10,
  });

  return NextResponse.json({
    totalSuppliers,
    todayFollowUps,
    overdueFollowUps,
    monthDealsCount: monthDeals._count,
    monthDealsValue: monthDeals._sum.totalValue || 0,
    monthQuantity: monthDeals._sum.quantity || 0,
    todayDealsValue: todayDeals._sum.totalValue || 0,
    todayDealsCount: todayDeals._count,
    stageBreakdown,
    topSuppliers: topSuppliers.map(s => ({
      id: s.id, name: s.name, phone: s.phone,
      dealCount: s._count.deals,
      totalValue: s.deals.reduce((sum, d) => sum + d.totalValue, 0),
    })),
    todayCallList,
    overdueList,
  });
}
