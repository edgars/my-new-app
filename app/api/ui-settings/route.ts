import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// UI Settings — per-entity grid column overrides (visibility, label, order).
// Global single config: one row per entity, shared by all users of this app.
// `columns` is stored as a JSON string for portability (Prisma `Json` is unsupported on sqlite).

type SavedCol = { key: string; label: string; visible: boolean; order: number };

// GET /api/ui-settings?entity=customers — returns the saved override array, or null if untouched.
export async function GET(req: NextRequest) {
  const entity = new URL(req.url).searchParams.get("entity");
  if (!entity) {
    return NextResponse.json({ error: "entity is required" }, { status: 400 });
  }
  const row = await prisma.uiSetting.findUnique({ where: { entity } });
  if (!row) return NextResponse.json(null);
  let columns: SavedCol[] | null = null;
  try {
    columns = JSON.parse(row.columns) as SavedCol[];
  } catch {
    columns = null;
  }
  return NextResponse.json(columns);
}

// PUT /api/ui-settings — upsert one entity's column override. Body: { entity, columns: SavedCol[] }.
export async function PUT(req: NextRequest) {
  const body = (await req.json()) as { entity?: string; columns?: SavedCol[] };
  if (!body.entity || !Array.isArray(body.columns)) {
    return NextResponse.json({ error: "entity and columns are required" }, { status: 400 });
  }
  const columns = JSON.stringify(body.columns);
  await prisma.uiSetting.upsert({
    where: { entity: body.entity },
    update: { columns },
    create: { entity: body.entity, columns },
  });
  return NextResponse.json({ ok: true });
}

// DELETE /api/ui-settings?entity=customers — reset to generated defaults (drops the override row).
export async function DELETE(req: NextRequest) {
  const entity = new URL(req.url).searchParams.get("entity");
  if (!entity) {
    return NextResponse.json({ error: "entity is required" }, { status: 400 });
  }
  await prisma.uiSetting.deleteMany({ where: { entity } });
  return NextResponse.json({ ok: true });
}
