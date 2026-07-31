import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postoGraduacaoSchema } from "@/lib/validation/postoGraduacao";

// GET /api/posto_graduacaos/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.postoGraduacao.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/posto_graduacaos/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = postoGraduacaoSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.postoGraduacao.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/posto_graduacaos/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.postoGraduacao.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
