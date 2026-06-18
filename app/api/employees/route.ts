import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validation/employee";

// GET /api/employees — paginated list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const [data, total] = await Promise.all([
    prisma.employee.findMany({ skip: (page - 1) * limit, take: limit }),
    prisma.employee.count(),
  ]);
  return NextResponse.json({ data, total, page, limit });
}

// POST /api/employees — create
export async function POST(req: NextRequest) {
  const parsed = employeeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.employee.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
