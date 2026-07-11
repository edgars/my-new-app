import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ncyachtSchema } from "@/lib/validation/ncyacht";

// GET /api/ncyachts/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.ncyacht.findUnique({ where: { yachtId: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/ncyachts/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = ncyachtSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.ncyacht.update({
    where: { yachtId: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/ncyachts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.ncyacht.delete({ where: { yachtId: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
