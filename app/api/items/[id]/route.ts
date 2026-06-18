import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { itemsSchema } from "@/lib/validation/items";

// GET /api/items/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.items.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/items/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = itemsSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.items.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/items/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.items.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
