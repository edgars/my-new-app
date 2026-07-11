"use client";
import { EntityForm } from "@/components/entity-form";
import { ncyachtSchema } from "@/lib/validation/ncyacht";

// Edit Ncyacht — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="ncyachts" route="ncyachts" label="Ncyacht" schema={ ncyachtSchema } mode="edit" />
  );
}
