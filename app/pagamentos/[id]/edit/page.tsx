"use client";
import { EntityForm } from "@/components/entity-form";
import { pagamentoSchema } from "@/lib/validation/pagamento";

// Edit Pagamento — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="pagamentos" route="pagamentos" label="Pagamento" schema={ pagamentoSchema } mode="edit" />
  );
}
