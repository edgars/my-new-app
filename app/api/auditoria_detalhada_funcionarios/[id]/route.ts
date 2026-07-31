import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auditoriaDetalhadaFuncionarioSchema } from "@/lib/validation/auditoriaDetalhadaFuncionario";

// GET /api/auditoria_detalhada_funcionarios/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.auditoriaDetalhadaFuncionario.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/auditoria_detalhada_funcionarios/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = auditoriaDetalhadaFuncionarioSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.auditoriaDetalhadaFuncionario.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/auditoria_detalhada_funcionarios/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.auditoriaDetalhadaFuncionario.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
