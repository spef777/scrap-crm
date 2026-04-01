import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const stage = searchParams.get("stage") || "";
  const scrapType = searchParams.get("scrapType") || "";
  const location = searchParams.get("location") || "";
  const tag = searchParams.get("tag") || "";
  const category = searchParams.get("category") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }
  if (stage) where.stage = stage;
  if (scrapType) where.scrapTypes = { has: scrapType };
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (tag) where.tags = { has: tag };
  if (category) where.category = category;

  const suppliers = await prisma.supplier.findMany({
    where,
    orderBy: [{ nextFollowUp: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { activities: true, deals: true } },
    },
  });

  return NextResponse.json(suppliers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const supplier = await prisma.supplier.create({
    data: {
      name: data.name,
      phone: data.phone,
      location: data.location || "",
      scrapTypes: data.scrapTypes || [],
      quantity: data.quantity || "",
      category: data.category || "SMALL",
      stage: data.stage || "NEW_LEAD",
      tags: data.tags || [],
      notes: data.notes || "",
      userId: session.user.id!,
    },
  });

  return NextResponse.json(supplier, { status: 201 });
}
