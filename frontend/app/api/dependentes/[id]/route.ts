import { NextRequest, NextResponse } from "next/server";

const API = process.env.SPRING_API_URL ?? "http://localhost:8080";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/dependentes/${params.id}`, { cache: "no-store" });
  return new NextResponse(await res.text(), {
    status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/dependentes/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await req.json()),
  });
  return new NextResponse(await res.text(), {
    status: res.status, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API}/dependentes/${params.id}`, { method: "DELETE" });
  return new NextResponse(null, { status: res.status });
}
