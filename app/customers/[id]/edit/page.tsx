"use client";
import { EntityForm } from "@/components/entity-form";
import { customerSchema } from "@/lib/validation/customer";

// Edit Ed Cust — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="customers" route="customers" label="Ed Cust" schema={ customerSchema } mode="edit" />
  );
}
