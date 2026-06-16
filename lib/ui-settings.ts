"use client";
import { useState, useEffect } from "react";

export type ColFormat = "currency" | "date" | "boolean";

export interface ColConfig {
  key: string;
  defaultLabel: string;
  label: string;
  visible: boolean;
  format?: ColFormat;
}

const STORAGE_KEY = "rnc.ui-settings";
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

function loadAll(): Record<string, { cols: ColConfig[] }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getEntityConfig(entity: string, defaults: ColConfig[]): ColConfig[] {
  const saved = loadAll()[entity];
  if (!saved) return defaults.map((d) => ({ ...d }));
  const savedMap = Object.fromEntries(saved.cols.map((c) => [c.key, c]));
  return defaults.map((d) => ({
    ...d,
    ...(savedMap[d.key] ? { label: savedMap[d.key].label, visible: savedMap[d.key].visible } : {}),
  }));
}

export function saveEntityConfig(entity: string, cols: ColConfig[]) {
  if (typeof window === "undefined") return;
  const all = loadAll();
  all[entity] = { cols };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function resetEntityConfig(entity: string) {
  if (typeof window === "undefined") return;
  const all = loadAll();
  delete all[entity];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useEntityConfig(entity: string, defaults: ColConfig[]): ColConfig[] {
  const [cols, setCols] = useState<ColConfig[]>(() =>
    typeof window !== "undefined" ? getEntityConfig(entity, defaults) : defaults.map((d) => ({ ...d }))
  );

  useEffect(() => {
    setCols(getEntityConfig(entity, defaults));
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setCols(getEntityConfig(entity, defaults));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [entity]); // eslint-disable-line react-hooks/exhaustive-deps

  return cols;
}
