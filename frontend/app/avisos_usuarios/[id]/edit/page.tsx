"use client";
import { EntityForm } from "@/components/entity-form";
import { avisosUsuarioSchema } from "@/lib/validation/avisosUsuario";

// Edit Avisos Usuario — data-driven form. Field order + visibility come from UI Settings → Form;
// widgets (text/number/date/currency/boolean/lookup) come from the generated field catalog.
export default function Page() {
  return (
    <EntityForm entity="avisos_usuarios" route="avisos_usuarios" label="Avisos Usuario" schema={ avisosUsuarioSchema } mode="edit" />
  );
}
