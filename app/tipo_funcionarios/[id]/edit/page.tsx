"use client";
import { EntityForm } from "@/components/entity-form";
import { tipoFuncionarioSchema } from "@/lib/validation/tipoFuncionario";

// Edit Tipo Funcionario — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="tipo_funcionarios" route="tipo_funcionarios" label="Tipo Funcionario" schema={ tipoFuncionarioSchema } mode="edit" />
  );
}
