import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withdrawSchema } from "@/lib/validation/withdraw";

// GET /api/withdraws/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.withdraw.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/withdraws/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = withdrawSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.withdraw.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/withdraws/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.withdraw.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
