"use client";
import { EntityForm } from "@/components/entity-form";
import { programaSocialSchema } from "@/lib/validation/programaSocial";

// Edit Programa Social — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="programa_socials" route="programa_socials" label="Programa Social" schema={ programaSocialSchema } mode="edit" />
  );
}
