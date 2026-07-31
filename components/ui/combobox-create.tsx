"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FieldDef = { name: string; label: string; inputType: string; required: boolean };

interface ComboboxCreateProps {
  name: string;
  route: string;
  optionLabel: string;
  createFields: FieldDef[];
  value: string;
  onChange: (v: string) => void;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function entityName(route: string): string {
  return route.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** Returns the best human-readable label for a row. Tries optionLabel first,
 *  then falls back to the first non-id string value so the user never sees a raw numeric ID. */
function rowLabel(row: any, optionLabel: string): string {
  if (row[optionLabel] != null && row[optionLabel] !== "") return String(row[optionLabel]);
  for (const [k, v] of Object.entries(row)) {
    if (k === "id" || k.endsWith("Id") || k.endsWith("_id")) continue;
    if (typeof v === "string" && v !== "") return v;
  }
  return String(row.id);
}

export function ComboboxCreate({ name, route, optionLabel, createFields, value, onChange }: ComboboxCreateProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swrKey = `/api/${route}?page=1&limit=100`;
  const { data } = useSWR(swrKey, fetcher);
  const rows: any[] = data?.data ?? [];
  const label = entityName(route);

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      await mutate(swrKey);
      onChange(String(created.id));
      setOpen(false);
      setForm({});
    } catch (e: any) {
      setError(e?.message ?? "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger id={name} className="flex-1">
            <SelectValue placeholder={`Select ${label}…`} />
          </SelectTrigger>
          <SelectContent>
            {rows.map((row) => (
              <SelectItem key={row.id} value={String(row.id)}>
                {rowLabel(row, optionLabel)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => { setForm({}); setError(null); setOpen(true); }}
          title={`Create new ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-semibold">New {label}</h3>
            {createFields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={`inline-${f.name}`}>
                  {f.label}
                  {f.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={`inline-${f.name}`}
                  type={f.inputType === "toggle" ? "text" : f.inputType}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                />
              </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setOpen(false); setForm({}); setError(null); }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleCreate} disabled={saving}>
                {saving ? "Saving…" : `Create ${label}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
