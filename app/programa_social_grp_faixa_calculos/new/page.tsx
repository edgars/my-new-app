"use client";
import { EntityForm } from "@/components/entity-form";
import { programaSocialGrpFaixaCalculoSchema } from "@/lib/validation/programaSocialGrpFaixaCalculo";

// New Programa Social Grp Faixa Calculo — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="programa_social_grp_faixa_calculos" route="programa_social_grp_faixa_calculos" label="Programa Social Grp Faixa Calculo" schema={ programaSocialGrpFaixaCalculoSchema } mode="create" />
  );
}
