"use client";
import { useState, useEffect } from "react";
import { ENTITY_FIELDS, type FieldWidget, type FieldRelation } from "@/lib/entity-fields";
import { ENTITY_COLS } from "@/lib/entity-columns";

export type ColFormat = "currency" | "date" | "boolean";

/**
 * Unified per-entity field config. ONE ordered list of every field; `grid`/`form` flags decide
 * visibility per context, `order` (shared) drives presentation order in BOTH the list/grid and the
 * create/edit form. Persisted as a partial override keyed by field; defaults come from the generated
 * ENTITY_FIELDS catalog so a regenerate never orphans rows.
 */
export interface FieldConfig {
  key: string;
  defaultLabel: string;
  label: string;
  widget: FieldWidget;
  format?: ColFormat;
  relation?: FieldRelation; // lookup target (Select wired to the referenced entity's API)
  grid: boolean;   // shown as a grid/table column
  form: boolean;   // shown in the create/edit form
  order: number;   // shared presentation order (grid + form)
  /** compat alias of `grid` — existing list pages read `.visible`. */
  visible: boolean;
}

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatValue(val: unknown, format?: ColFormat): string {
  if (val === null || val === undefined) return "";
  switch (format) {
    case "currency": {
      const n = Number(val);
      return isNaN(n) ? "" : USD.format(n);
    }
    case "date":
      return String(val).substring(0, 10);
    case "boolean":
      return val ? "Yes" : "No";
    default:
      return String(val);
  }
}

// ── persistence shape: partial override per field (DB single source of truth) ──
type SavedField = {
  key: string;
  label: string;
  grid: boolean;
  form: boolean;
  order: number;
  // legacy rows (grid-only editor) used `visible` instead of grid/form:
  visible?: boolean;
};

/** Defaults for an entity: catalog order, grid-visible = was a curated grid column, form-visible = all. */
function defaultsFor(entity: string): FieldConfig[] {
  const meta = ENTITY_FIELDS[entity] ?? [];
  const gridKeys = new Set((ENTITY_COLS[entity] ?? []).map((c) => c.key));
  return meta.map((m, i) => ({
    key: m.key,
    defaultLabel: m.label,
    label: m.label,
    widget: m.widget,
    format: m.format,
    relation: m.relation,
    grid: gridKeys.has(m.key),
    form: true,
    order: i,
    visible: gridKeys.has(m.key),
  }));
}

/** Merge a saved override onto catalog defaults, then sort by shared order. */
function merge(entity: string, saved: SavedField[] | null): FieldConfig[] {
  const base = defaultsFor(entity);
  if (saved && saved.length) {
    const byKey = Object.fromEntries(saved.map((s) => [s.key, s]));
    base.forEach((c) => {
      const s = byKey[c.key];
      if (!s) return;
      c.label = s.label ?? c.label;
      // back-compat: legacy rows only stored `visible` (grid). Map → grid, keep form default true.
      c.grid = s.grid !== undefined ? !!s.grid : !!s.visible;
      c.form = s.form !== undefined ? !!s.form : true;
      c.order = s.order ?? c.order;
      c.visible = c.grid;
    });
  }
  return base.sort((a, b) => a.order - b.order);
}

export async function fetchEntityConfig(entity: string): Promise<FieldConfig[]> {
  try {
    const res = await fetch(`/api/ui-settings?entity=${encodeURIComponent(entity)}`);
    if (!res.ok) return merge(entity, null);
    return merge(entity, (await res.json()) as SavedField[] | null);
  } catch {
    return merge(entity, null);
  }
}

export async function saveEntityConfig(entity: string, cols: FieldConfig[]): Promise<void> {
  const payload: SavedField[] = cols.map((c, i) => ({
    key: c.key,
    label: c.label,
    grid: c.grid,
    form: c.form,
    order: i,
  }));
  await fetch("/api/ui-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity, columns: payload }),
  });
}

export async function resetEntityConfig(entity: string): Promise<void> {
  await fetch(`/api/ui-settings?entity=${encodeURIComponent(entity)}`, { method: "DELETE" });
}

/**
 * Reactive config for list pages + forms. Renders catalog defaults immediately, swaps in the
 * persisted override once /api/ui-settings resolves. (Second arg accepted for back-compat with
 * existing list pages that passed defaults; ignored — defaults now come from the catalog.)
 */
export function useEntityConfig(entity: string, _ignored?: unknown): FieldConfig[] {
  const [cols, setCols] = useState<FieldConfig[]>(() => merge(entity, null));
  useEffect(() => {
    let alive = true;
    fetchEntityConfig(entity).then((c) => { if (alive) setCols(c); });
    return () => { alive = false; };
  }, [entity]);
  return cols;
}
