import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminDetailsSchema } from "@/lib/validation/adminDetails";

// GET /api/admin_details/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.adminDetails.findUnique({ where: { id: Number(params.id) } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

// PUT /api/admin_details/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = adminDetailsSchema.partial().safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.adminDetails.update({
    where: { id: Number(params.id) },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin_details/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.adminDetails.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
