"use client";
import { EntityForm } from "@/components/entity-form";
import { partsSchema } from "@/lib/validation/parts";

// Edit Ed Parts — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="parts" route="parts" label="Ed Parts" schema={ partsSchema } mode="edit" />
  );
}
