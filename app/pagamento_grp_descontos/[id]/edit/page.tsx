"use client";
import { EntityForm } from "@/components/entity-form";
import { pagamentoGrpDescontoSchema } from "@/lib/validation/pagamentoGrpDesconto";

// Edit Pagamento Grp Desconto — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="pagamento_grp_descontos" route="pagamento_grp_descontos" label="Pagamento Grp Desconto" schema={ pagamentoGrpDescontoSchema } mode="edit" />
  );
}
