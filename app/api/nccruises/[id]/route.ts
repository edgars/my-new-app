import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nccruiseSchema } from "@/lib/validation/nccruise";

// GET /api/nccruises/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.nccruise.findUnique({ where: { cruiseId: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/nccruises/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = nccruiseSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.nccruise.update({
    where: { cruiseId: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/nccruises/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.nccruise.delete({ where: { cruiseId: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
