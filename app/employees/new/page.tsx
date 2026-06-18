"use client";
import { EntityForm } from "@/components/entity-form";
import { employeeSchema } from "@/lib/validation/employee";

// New Employee — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="employees" route="employees" label="Employee" schema={ employeeSchema } mode="create" />
  );
}
