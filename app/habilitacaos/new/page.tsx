"use client";
import { EntityForm } from "@/components/entity-form";
import { habilitacaoSchema } from "@/lib/validation/habilitacao";

// New Habilitacaosel — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="habilitacaos" route="habilitacaos" label="Habilitacaosel" schema={ habilitacaoSchema } mode="create" />
  );
}
