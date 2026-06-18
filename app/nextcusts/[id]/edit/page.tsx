"use client";
import { EntityForm } from "@/components/entity-form";
import { nextcustSchema } from "@/lib/validation/nextcust";

// Edit Nextcust — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="nextcusts" route="nextcusts" label="Nextcust" schema={ nextcustSchema } mode="edit" />
  );
}
