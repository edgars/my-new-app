"use client";
import { EntityForm } from "@/components/entity-form";
import { beneficiarioSchema } from "@/lib/validation/beneficiario";

// New Beneficiario — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="beneficiarios" route="beneficiarios" label="Beneficiario" schema={ beneficiarioSchema } mode="create" />
  );
}
