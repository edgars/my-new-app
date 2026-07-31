"use client";
import { EntityForm } from "@/components/entity-form";
import { funcionarioSchema } from "@/lib/validation/funcionario";

// New Funcionário — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="funcionarios" route="funcionarios" label="Funcionário" schema={ funcionarioSchema } mode="create" />
  );
}
