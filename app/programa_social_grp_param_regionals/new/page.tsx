"use client";
import { EntityForm } from "@/components/entity-form";
import { programaSocialGrpParamRegionalSchema } from "@/lib/validation/programaSocialGrpParamRegional";

// New Programa Social Grp Param Regional — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="programa_social_grp_param_regionals" route="programa_social_grp_param_regionals" label="Programa Social Grp Param Regional" schema={ programaSocialGrpParamRegionalSchema } mode="create" />
  );
}
