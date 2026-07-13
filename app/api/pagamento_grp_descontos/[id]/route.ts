import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pagamentoGrpDescontoSchema } from "@/lib/validation/pagamentoGrpDesconto";

// GET /api/pagamento_grp_descontos/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.pagamentoGrpDesconto.findUnique({ where: { occurrence: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/pagamento_grp_descontos/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = pagamentoGrpDescontoSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.pagamentoGrpDesconto.update({
    where: { occurrence: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/pagamento_grp_descontos/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.pagamentoGrpDesconto.delete({ where: { occurrence: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
