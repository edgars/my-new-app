import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nccruiseSchema } from "@/lib/validation/nccruise";

// GET /api/nccruises — paginated list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const [data, total] = await Promise.all([
    prisma.nccruise.findMany({ skip: (page - 1) * limit, take: limit }),
    prisma.nccruise.count(),
  ]);
  return NextResponse.json({ data, total, page, limit });
}

// POST /api/nccruises — create
export async function POST(req: NextRequest) {
  const parsed = nccruiseSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.nccruise.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
