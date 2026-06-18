"use client";
import { EntityForm } from "@/components/entity-form";
import { vendorsSchema } from "@/lib/validation/vendors";

// New Vendors — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="vendors" route="vendors" label="Vendors" schema={ vendorsSchema } mode="create" />
  );
}
