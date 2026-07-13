import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { beneficiarioGrpDependenteSchema } from "@/lib/validation/beneficiarioGrpDependente";

// GET /api/beneficiario_grp_dependentes/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.beneficiarioGrpDependente.findUnique({ where: { occurrence: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/beneficiario_grp_dependentes/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = beneficiarioGrpDependenteSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.beneficiarioGrpDependente.update({
    where: { occurrence: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/beneficiario_grp_dependentes/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.beneficiarioGrpDependente.delete({ where: { occurrence: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
