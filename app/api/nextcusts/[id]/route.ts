import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextcustSchema } from "@/lib/validation/nextcust";

// GET /api/nextcusts/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.nextcust.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/nextcusts/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = nextcustSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.nextcust.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/nextcusts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.nextcust.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
