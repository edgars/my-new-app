"use client";
import { EntityForm } from "@/components/entity-form";
import { postoGraduacaoSchema } from "@/lib/validation/postoGraduacao";

// New Posto Graduação — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="posto_graduacaos" route="posto_graduacaos" label="Posto Graduação" schema={ postoGraduacaoSchema } mode="create" />
  );
}
