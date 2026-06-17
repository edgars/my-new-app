"use client";
import { useState, useEffect } from "react";

export type ColFormat = "currency" | "date" | "boolean";

export interface ColConfig {
  key: string;
  defaultLabel: string;
  label: string;
  visible: boolean;
  order: number;
  format?: ColFormat;
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

// ── persistence: ui_settings table via /api/ui-settings (DB is the single source of truth) ──
// Persisted shape per entity is a partial column override: { key, label, visible, order }.
// Defaults (keys, formats, base labels) always come from ENTITY_COLS — the table only stores
// what the user changed, so adding/removing entity columns in a regenerate never orphans rows.

type SavedCol = { key: string; label: string; visible: boolean; order: number };

/** Merge a saved override (by key) onto the generated defaults, then sort by order. */
function merge(defaults: ColConfig[], saved: SavedCol[] | null): ColConfig[] {
  const base = defaults.map((d) => ({ ...d }));
  if (saved && saved.length) {
    const byKey = Object.fromEntries(saved.map((c) => [c.key, c]));
    for (const col of base) {
      const s = byKey[col.key];
      if (s) {
        col.label = s.label;
        col.visible = s.visible;
        col.order = s.order;
      }
    }
  }
  return base.sort((a, b) => a.order - b.order);
}

export async function fetchEntityConfig(entity: string, defaults: ColConfig[]): Promise<ColConfig[]> {
  try {
    const res = await fetch(`/api/ui-settings?entity=${encodeURIComponent(entity)}`);
    if (!res.ok) return merge(defaults, null);
    const saved = (await res.json()) as SavedCol[] | null;
    return merge(defaults, saved);
  } catch {
    return merge(defaults, null);
  }
}

export async function saveEntityConfig(entity: string, cols: ColConfig[]): Promise<void> {
  const payload: SavedCol[] = cols.map((c, i) => ({
    key: c.key,
    label: c.label,
    visible: c.visible,
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
 * List/grid hook. Renders the generated defaults immediately, then swaps in the persisted
 * override once /api/ui-settings resolves. Sync return type keeps list pages logic-free.
 */
export function useEntityConfig(entity: string, defaults: ColConfig[]): ColConfig[] {
  const [cols, setCols] = useState<ColConfig[]>(() => merge(defaults, null));

  useEffect(() => {
    let alive = true;
    fetchEntityConfig(entity, defaults).then((c) => {
      if (alive) setCols(c);
    });
    return () => {
      alive = false;
    };
  }, [entity]); // eslint-disable-line react-hooks/exhaustive-deps

  return cols;
}
