import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newCustomerRegistrationSchema } from "@/lib/validation/newCustomerRegistration";

// GET /api/new_customer_registrations — paginated list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const [data, total] = await Promise.all([
    prisma.newCustomerRegistration.findMany({ skip: (page - 1) * limit, take: limit }),
    prisma.newCustomerRegistration.count(),
  ]);
  return NextResponse.json({ data, total, page, limit });
}

// POST /api/new_customer_registrations — create
export async function POST(req: NextRequest) {
  const parsed = newCustomerRegistrationSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.newCustomerRegistration.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
