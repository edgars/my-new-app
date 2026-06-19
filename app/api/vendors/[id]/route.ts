import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vendorsSchema } from "@/lib/validation/vendors";

// GET /api/vendors/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.vendors.findUnique({ where: { vendorno: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/vendors/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = vendorsSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.vendors.update({
    where: { vendorno: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/vendors/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.vendors.delete({ where: { vendorno: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
