import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lotacaoSchema } from "@/lib/validation/lotacao";

// GET /api/lotacaos — paginated list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const [data, total] = await Promise.all([
    prisma.lotacao.findMany({ skip: (page - 1) * limit, take: limit }),
    prisma.lotacao.count(),
  ]);
  return NextResponse.json({ data, total, page, limit });
}

// POST /api/lotacaos — create
export async function POST(req: NextRequest) {
  const parsed = lotacaoSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.lotacao.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
