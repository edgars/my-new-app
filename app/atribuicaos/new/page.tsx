"use client";
import { EntityForm } from "@/components/entity-form";
import { atribuicaoSchema } from "@/lib/validation/atribuicao";

// New Atribuição — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="atribuicaos" route="atribuicaos" label="Atribuição" schema={ atribuicaoSchema } mode="create" />
  );
}
