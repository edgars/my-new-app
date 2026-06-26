"use client";
import { EntityForm } from "@/components/entity-form";
import { lotacaoSchema } from "@/lib/validation/lotacao";

// Edit Lotacao — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="lotacaos" route="lotacaos" label="Lotacao" schema={ lotacaoSchema } mode="edit" />
  );
}
