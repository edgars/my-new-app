"use client";
import { useState, useEffect } from "react";
import { ENTITY_FIELDS, type FieldWidget, type FieldRelation } from "@/lib/entity-fields";
import { ENTITY_COLS } from "@/lib/entity-columns";

// localStorage variant of ui-settings — used by the decoupled (Spring backend) build. UI grid
// prefs are per-browser, not server state, so the frontend needs no local database. Same public
// API as the prisma-backed version, so pages and /settings are unchanged.

export type ColFormat = "currency" | "date" | "boolean";

export interface FieldConfig {
  key: string;
  defaultLabel: string;
  label: string;
  widget: FieldWidget;
  format?: ColFormat;
  relation?: FieldRelation;
  grid: boolean;
  form: boolean;
  order: number;
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

type SavedField = {
  key: string;
  label: string;
  grid: boolean;
  form: boolean;
  order: number;
  visible?: boolean;
};

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

function merge(entity: string, saved: SavedField[] | null): FieldConfig[] {
  const base = defaultsFor(entity);
  if (saved && saved.length) {
    const byKey = Object.fromEntries(saved.map((s) => [s.key, s]));
    base.forEach((c) => {
      const s = byKey[c.key];
      if (!s) return;
      c.label = s.label ?? c.label;
      c.grid = s.grid !== undefined ? !!s.grid : !!s.visible;
      c.form = s.form !== undefined ? !!s.form : true;
      c.order = s.order ?? c.order;
      c.visible = c.grid;
    });
  }
  return base.sort((a, b) => a.order - b.order);
}

const STORE_KEY = (entity: string) => `rnc_ui_settings_${entity}`;

function loadSaved(entity: string): SavedField[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORE_KEY(entity));
    return raw ? (JSON.parse(raw) as SavedField[]) : null;
  } catch {
    return null;
  }
}

export async function fetchEntityConfig(entity: string): Promise<FieldConfig[]> {
  return merge(entity, loadSaved(entity));
}

export async function saveEntityConfig(entity: string, cols: FieldConfig[]): Promise<void> {
  const payload: SavedField[] = cols.map((c, i) => ({
    key: c.key,
    label: c.label,
    grid: c.grid,
    form: c.form,
    order: i,
  }));
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY(entity), JSON.stringify(payload));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export async function resetEntityConfig(entity: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORE_KEY(entity));
  } catch {
    /* ignore */
  }
}

/**
 * Reactive config for list pages + forms. Renders catalog defaults immediately (SSR-safe), swaps
 * in the localStorage override after mount. (Second arg accepted for back-compat with existing
 * list pages that passed defaults; ignored — defaults now come from the catalog.)
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
