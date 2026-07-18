"use client";
import { EntityForm } from "@/components/entity-form";
import { cursoSchema } from "@/lib/validation/curso";

// Edit Curso — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="cursos" route="cursos" label="Curso" schema={ cursoSchema } mode="edit" />
  );
}
