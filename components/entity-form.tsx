"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ZodTypeAny } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchEntityConfig, type FieldConfig } from "@/lib/ui-settings";
import type { FieldRelation } from "@/lib/entity-fields";
import { APP_CONFIG } from "@/lib/app-config";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Lookup field → options fetched live from the referenced entity's API. Stores the target's
 *  natural key (relation.valueField, e.g. custno) — the app manages the association by that key. */
function RelationSelect({ relation, value, onChange }: {
  relation: FieldRelation; value: unknown; onChange: (v: number | null) => void;
}) {
  const { data } = useSWR(`/api/${relation.route}?page=1&limit=200`, fetcher);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[] = data?.data ?? [];
  const has = value !== null && value !== undefined && value !== "";
  // Resolve the label for the CURRENT value from the fetched rows and render it directly in the
  // trigger. Radix shows the placeholder until its <SelectItem>s mount (they mount on open), so on
  // an edit form the pre-selected value would otherwise look empty. Driving the trigger text from
  // our own data makes the stored value display immediately, independent of item registration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selected = has ? rows.find((r) => String(r[relation.valueField]) === String(value)) : undefined;
  const selectedLabel = selected
    ? String(selected[relation.labelField] ?? selected[relation.valueField] ?? value)
    : (has ? String(value) : "");
  return (
    <Select
      value={has ? String(value) : ""}
      onValueChange={(v) => onChange(v === "" ? null : Number(v))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select…">{has ? selectedLabel : undefined}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {rows.map((row) => {
          const val = row[relation.valueField];
          const label = row[relation.labelField] ?? val ?? row.id;
          return <SelectItem key={String(val)} value={String(val)}>{String(label)}</SelectItem>;
        })}
      </SelectContent>
    </Select>
  );
}

/**
 * Data-driven create/edit form. Fields, their order and their visibility come from the per-entity
 * UI Settings config (the `form` context), so reordering / hiding in Settings → Form is reflected
 * here with no code change. Widget is chosen from each field's catalog type.
 */
export function EntityForm({ entity, route, label, schema, mode }: {
  entity: string;
  route: string;
  label: string;
  schema: ZodTypeAny;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = mode === "edit" ? params.id : null;

  const [fields, setFields] = useState<FieldConfig[] | null>(null);
  const { data, isLoading } = useSWR(id ? `/api/${route}/${id}` : null, fetcher);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useForm<any>({ resolver: zodResolver(schema as any) });

  useEffect(() => {
    let alive = true;
    fetchEntityConfig(entity).then((c) => { if (alive) setFields(c.filter((f) => f.form)); });
    return () => { alive = false; };
  }, [entity]);

  useEffect(() => {
    if (!data) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v: any = { ...data };
    for (const k of Object.keys(v)) {
      if (typeof v[k] === "string" && /^\d{4}-\d\d-\d\dT/.test(v[k])) v[k] = v[k].substring(0, 10);
    }
    reset(v);
  }, [data, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: any) {
    const url = id ? `/api/${route}/${id}` : `/api/${route}`;
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push(`/${route}`);
  }

  async function onDelete() {
    if (!id) return;
    const res = await fetch(`/api/${route}/${id}`, { method: "DELETE" });
    if (res.ok) router.push(`/${route}`);
  }

  const ready = fields !== null && !(mode === "edit" && isLoading);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = errors as any;

  return (
    <div className="w-full px-6 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href={`/${route}`}><ArrowLeft className="h-4 w-4" /> Back to {label}</Link>
      </Button>
      {!ready ? (
        <Card>
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{mode === "edit" ? `Edit ${label}` : `New ${label}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields!.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No fields enabled for the form. Enable some in Settings → Form.
                </p>
              )}
              {fields!.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label htmlFor={f.key} className="text-sm font-medium">{f.label}</label>
                  {f.widget === "lookup" && f.relation ? (
                    <Controller control={control} name={f.key} render={({ field }) => (
                      <RelationSelect relation={f.relation!} value={field.value} onChange={field.onChange} />
                    )} />
                  ) : f.widget === "boolean" ? (
                    <Controller control={control} name={f.key} render={({ field }) => (
                      <div><Switch checked={!!field.value} onCheckedChange={field.onChange} /></div>
                    )} />
                  ) : f.format === "currency" ? (
                    // Currency field — show the locale currency symbol as an input prefix.
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {APP_CONFIG.currencySymbol}
                      </span>
                      <Input
                        id={f.key}
                        type="number"
                        step="any"
                        inputMode="decimal"
                        className="pl-10"
                        placeholder="0.00"
                        {...register(f.key)}
                      />
                    </div>
                  ) : (
                    <Input
                      id={f.key}
                      type={f.widget === "number" ? "number" : f.widget === "date" ? "date" : "text"}
                      step={f.widget === "number" ? "any" : undefined}
                      placeholder={`Enter ${f.label.toLowerCase()}`}
                      {...register(f.key)}
                    />
                  )}
                  {err[f.key] && <p className="text-sm text-destructive">{String(err[f.key]?.message ?? "")}</p>}
                </div>
              ))}
            </CardContent>
            <CardFooter className="justify-between gap-2">
              {mode === "edit" ? (
                <Button type="button" variant="outline" onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              ) : <span />}
              <Button type="submit" disabled={isSubmitting}>
                {mode === "edit" ? "Save changes" : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
