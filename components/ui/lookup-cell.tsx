"use client";
import useSWR from "swr";
import type { FieldRelation } from "@/lib/entity-fields";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * Grid cell for a lookup (FK) column. The stored value is the related row's key
 * (relation.valueField); we fetch the referenced entity once (SWR dedupes across cells/rows)
 * and render its human label (relation.labelField) instead of the raw numeric key.
 * Falls back to the raw value if the row isn't found yet.
 */
export function LookupCell({ relation, value }: { relation: FieldRelation; value: unknown }) {
  const key = value === null || value === undefined || value === ""
    ? null
    : `/api/${relation.route}?page=1&limit=200`;
  const { data } = useSWR(key, fetcher);
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = data?.data ?? [];
  const match = rows.find((r) => String(r[relation.valueField]) === String(value));
  const label = match ? (match[relation.labelField] ?? match[relation.valueField] ?? value) : value;
  return <span>{String(label)}</span>;
}
