"use client";
import { EntityForm } from "@/components/entity-form";
import { mesAnoFeriasSchema } from "@/lib/validation/mesAnoFerias";

// Edit Mes Ano Ferias — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="mes_ano_ferias" route="mes_ano_ferias" label="Mes Ano Ferias" schema={ mesAnoFeriasSchema } mode="edit" />
  );
}
