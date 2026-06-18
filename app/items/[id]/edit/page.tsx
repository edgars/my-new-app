"use client";
import { EntityForm } from "@/components/entity-form";
import { itemsSchema } from "@/lib/validation/items";

// Edit Items — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="items" route="items" label="Items" schema={ itemsSchema } mode="edit" />
  );
}
