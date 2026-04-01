import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const rows: any[] = data.rows || [];

  let created = 0, errors = 0;
  for (const row of rows) {
    try {
      await prisma.supplier.create({
        data: {
          name: row.name || "Unknown",
          phone: row.phone || "",
          location: row.location || "",
          scrapTypes: row.scrapTypes ? row.scrapTypes.split(",").map((s: string) => s.trim().toLowerCase()) : [],
          quantity: row.quantity || "",
          category: (row.category || "SMALL").toUpperCase(),
          stage: "NEW_LEAD",
          tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : [],
          notes: row.notes || "",
          userId: session.user.id!,
        },
      });
      created++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ created, errors });
}
