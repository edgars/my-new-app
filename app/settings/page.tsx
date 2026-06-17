"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Settings2, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { fetchEntityConfig, saveEntityConfig, resetEntityConfig, type ColConfig } from "@/lib/ui-settings";
import { ENTITY_COLS, ENTITY_LABELS } from "@/lib/entity-columns";

const ENTITIES = Object.keys(ENTITY_COLS);

function SettingsContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("entity") ?? ENTITIES[0];
  const [entity, setEntity] = useState(() =>
    ENTITIES.includes(initial) ? initial : ENTITIES[0]
  );
  const [cols, setCols] = useState<ColConfig[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEntityConfig(entity, ENTITY_COLS[entity]).then((c) => {
      if (alive) setCols(c);
    });
    setSaved(false);
    return () => {
      alive = false;
    };
  }, [entity]);

  function toggle(key: string) {
    setCols((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));
  }

  function rename(key: string, label: string) {
    setCols((prev) => prev.map((c) => (c.key === key ? { ...c, label } : c)));
  }

  // Move a row up/down. Order is implied by array position and persisted as the `order` index.
  function move(index: number, delta: number) {
    setCols((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    await saveEntityConfig(entity, cols);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function reset() {
    await resetEntityConfig(entity);
    setCols(await fetchEntityConfig(entity, ENTITY_COLS[entity]));
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Settings2 className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">UI Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure column order, visibility and labels for each entity grid
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
                {ENTITY_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Column editor */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {ENTITY_LABELS[entity]} — Grid Columns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-[56px_40px_1fr_96px_64px] items-center gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
                  <span className="text-center">Order</span>
                  <span className="text-center">Show</span>
                  <span>Label</span>
                  <span className="text-center">Field Key</span>
                  <span className="text-center">Format</span>
                </div>
                {cols.map((col, i) => (
                  <div
                    key={col.key}
                    className="grid grid-cols-[56px_40px_1fr_96px_64px] items-center gap-3"
                  >
                    <div className="flex justify-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={i === cols.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <Switch
                        checked={col.visible}
                        onCheckedChange={() => toggle(col.key)}
                      />
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
                      {col.format ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset defaults
              </Button>
              <Button size="sm" onClick={save}>
                {saved ? "Saved!" : "Save changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
