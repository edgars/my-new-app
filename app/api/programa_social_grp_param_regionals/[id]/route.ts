import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { programaSocialGrpParamRegionalSchema } from "@/lib/validation/programaSocialGrpParamRegional";

// GET /api/programa_social_grp_param_regionals/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.programaSocialGrpParamRegional.findUnique({ where: { occurrence: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/programa_social_grp_param_regionals/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = programaSocialGrpParamRegionalSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.programaSocialGrpParamRegional.update({
    where: { occurrence: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/programa_social_grp_param_regionals/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.programaSocialGrpParamRegional.delete({ where: { occurrence: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
