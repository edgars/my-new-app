"use client";
import { useState, useEffect, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Settings2, RotateCcw, GripVertical, LayoutList, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { fetchEntityConfig, saveEntityConfig, resetEntityConfig, type FieldConfig } from "@/lib/ui-settings";
import { ENTITY_FIELDS } from "@/lib/entity-fields";
import { ENTITY_LABELS } from "@/lib/entity-columns";

const ENTITIES = Object.keys(ENTITY_FIELDS);
type Tab = "form" | "grid";

function SettingsContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("entity") ?? ENTITIES[0];
  const [entity, setEntity] = useState(() => (ENTITIES.includes(initial) ? initial : ENTITIES[0]));
  const [tab, setTab] = useState<Tab>("form");
  const [cols, setCols] = useState<FieldConfig[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEntityConfig(entity).then((c) => { if (alive) setCols(c); });
    setSaved(false);
    return () => { alive = false; };
  }, [entity]);

  // Visibility toggles the active context only; order is shared across both.
  function toggleVis(key: string) {
    setCols((prev) =>
      prev.map((c) => {
        if (c.key !== key) return c;
        return tab === "grid" ? { ...c, grid: !c.grid, visible: !c.grid } : { ...c, form: !c.form };
      }),
    );
  }

  function rename(key: string, label: string) {
    setCols((prev) => prev.map((c) => (c.key === key ? { ...c, label } : c)));
  }

  function reorder(to: number) {
    setCols((prev) => {
      if (dragIdx === null || dragIdx === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragIdx(null);
  }

  async function save() {
    await saveEntityConfig(entity, cols);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function reset() {
    await resetEntityConfig(entity);
    setCols(await fetchEntityConfig(entity));
  }

  const isOn = (c: FieldConfig) => (tab === "grid" ? c.grid : c.form);
  const onCount = cols.filter(isOn).length;

  return (
    <div className="w-full px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Settings2 className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">UI Settings</h1>
          <p className="text-sm text-muted-foreground">
            Drag to reorder (applies to both list and form). Toggle visibility per context, rename labels.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Entity nav */}
        <div className="w-44 shrink-0">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entities
          </p>
          <div className="space-y-1">
            {ENTITIES.map((e) => (
              <button
                key={e}
                onClick={() => setEntity(e)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  entity === e
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {ENTITY_LABELS[e] ?? e}
              </button>
            ))}
          </div>
        </div>

        {/* Field editor */}
        <div className="min-w-0 flex-1">
          <Card>
            <CardHeader className="gap-3">
              <CardTitle className="text-base">{ENTITY_LABELS[entity] ?? entity}</CardTitle>
              {/* Form / Grid tabs */}
              <div className="flex w-fit rounded-lg bg-muted p-1">
                <TabBtn active={tab === "form"} onClick={() => setTab("form")} icon={<LayoutList className="h-3.5 w-3.5" />} label="Form" />
                <TabBtn active={tab === "grid"} onClick={() => setTab("grid")} icon={<Table2 className="h-3.5 w-3.5" />} label="Grid" />
              </div>
              <p className="text-xs text-muted-foreground">
                {tab === "form"
                  ? "Fields shown in the create/edit form, in this order."
                  : "Columns shown in the list/table, in this order."}
                {" "}<span className="font-medium text-foreground">{onCount}</span> of {cols.length} visible.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-[28px_44px_1fr_110px_70px] items-center gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
                  <span></span>
                  <span className="text-center">Show</span>
                  <span>Label</span>
                  <span className="text-center">Field</span>
                  <span className="text-center">Type</span>
                </div>
                {cols.map((col, i) => (
                  <div
                    key={col.key}
                    draggable
                    onDragStart={() => setDragIdx(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => reorder(i)}
                    className={`grid grid-cols-[28px_44px_1fr_110px_70px] items-center gap-3 rounded-md py-1 transition-colors ${
                      dragIdx === i ? "bg-accent" : "hover:bg-muted/50"
                    } ${isOn(col) ? "" : "opacity-50"}`}
                  >
                    <span className="flex cursor-grab justify-center text-muted-foreground active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <div className="flex justify-center">
                      <Switch checked={isOn(col)} onCheckedChange={() => toggleVis(col.key)} />
                    </div>
                    <Input
                      value={col.label}
                      onChange={(e) => rename(col.key, e.target.value)}
                      className="h-8 text-sm"
                    />
                    <code className="truncate rounded bg-muted px-2 py-1 text-center text-xs text-muted-foreground">
                      {col.key}
                    </code>
                    <span className="text-center text-xs text-muted-foreground">
                      {col.format ?? col.widget}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset defaults
              </Button>
              <Button size="sm" onClick={save}>{saved ? "Saved!" : "Save changes"}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}{label}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
