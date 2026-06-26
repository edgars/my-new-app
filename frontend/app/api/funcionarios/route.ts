import { NextRequest, NextResponse } from "next/server";

const API = process.env.SPRING_API_URL ?? "http://localhost:8080";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
  const res = await fetch(`${API}/funcionarios`, { cache: "no-store" });
  if (!res.ok) return NextResponse.json({ data: [], total: 0, page, limit }, { status: res.status });
  const all = (await res.json()) as unknown[];
  const total = Array.isArray(all) ? all.length : 0;
  const data = Array.isArray(all) ? all.slice((page - 1) * limit, page * limit) : [];
  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const res = await fetch(`${API}/funcionarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await req.json()),
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
