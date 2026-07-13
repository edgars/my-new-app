"use client";
import { EntityForm } from "@/components/entity-form";
import { auditoriaSchema } from "@/lib/validation/auditoria";

// New Auditoria — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="auditorias" route="auditorias" label="Auditoria" schema={ auditoriaSchema } mode="create" />
  );
}
