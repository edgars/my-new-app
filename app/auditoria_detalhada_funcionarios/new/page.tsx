"use client";
import { EntityForm } from "@/components/entity-form";
import { auditoriaDetalhadaFuncionarioSchema } from "@/lib/validation/auditoriaDetalhadaFuncionario";

// New Auddetfuncionario Man — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="auditoria_detalhada_funcionarios" route="auditoria_detalhada_funcionarios" label="Auddetfuncionario Man" schema={ auditoriaDetalhadaFuncionarioSchema } mode="create" />
  );
}
