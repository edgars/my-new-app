"use client";
import { EntityForm } from "@/components/entity-form";
import { ordersSchema } from "@/lib/validation/orders";

// New Ed Order — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="orders" route="orders" label="Ed Order" schema={ ordersSchema } mode="create" />
  );
}
