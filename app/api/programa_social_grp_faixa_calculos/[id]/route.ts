import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { programaSocialGrpFaixaCalculoSchema } from "@/lib/validation/programaSocialGrpFaixaCalculo";

// GET /api/programa_social_grp_faixa_calculos/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.programaSocialGrpFaixaCalculo.findUnique({ where: { occurrence: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/programa_social_grp_faixa_calculos/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = programaSocialGrpFaixaCalculoSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.programaSocialGrpFaixaCalculo.update({
    where: { occurrence: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/programa_social_grp_faixa_calculos/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.programaSocialGrpFaixaCalculo.delete({ where: { occurrence: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
