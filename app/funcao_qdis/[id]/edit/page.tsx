"use client";
import { EntityForm } from "@/components/entity-form";
import { funcaoQdiSchema } from "@/lib/validation/funcaoQdi";

// Edit Funcaoqdi — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="funcao_qdis" route="funcao_qdis" label="Funcaoqdi" schema={ funcaoQdiSchema } mode="edit" />
  );
}
