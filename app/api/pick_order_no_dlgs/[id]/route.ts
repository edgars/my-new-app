import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pickOrderNoDlgSchema } from "@/lib/validation/pickOrderNoDlg";

// GET /api/pick_order_no_dlgs/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.pickOrderNoDlg.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/pick_order_no_dlgs/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = pickOrderNoDlgSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.pickOrderNoDlg.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/pick_order_no_dlgs/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.pickOrderNoDlg.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
