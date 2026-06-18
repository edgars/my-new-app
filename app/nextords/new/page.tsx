"use client";
import { EntityForm } from "@/components/entity-form";
import { nextordSchema } from "@/lib/validation/nextord";

// New Nextord — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="nextords" route="nextords" label="Nextord" schema={ nextordSchema } mode="create" />
  );
}
