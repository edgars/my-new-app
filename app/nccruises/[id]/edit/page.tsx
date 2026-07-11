"use client";
import { EntityForm } from "@/components/entity-form";
import { nccruiseSchema } from "@/lib/validation/nccruise";

// Edit Nccruise — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="nccruises" route="nccruises" label="Nccruise" schema={ nccruiseSchema } mode="edit" />
  );
}
