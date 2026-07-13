"use client";
import { EntityForm } from "@/components/entity-form";
import { beneficiarioGrpDependenteSchema } from "@/lib/validation/beneficiarioGrpDependente";

// New Beneficiario Grp Dependente — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="beneficiario_grp_dependentes" route="beneficiario_grp_dependentes" label="Beneficiario Grp Dependente" schema={ beneficiarioGrpDependenteSchema } mode="create" />
  );
}
