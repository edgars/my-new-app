"use client";
import { Input } from "@/components/ui/input";
import { applyMask } from "@/lib/masks";

const CEP_MASK = "#####-###";

export interface CepAddress {
  logradouro?: string;
  bairro?: string;
  localidade?: string; // cidade
  uf?: string;
}

/**
 * Masked CEP input with ViaCEP auto-fill on blur. When the CEP resolves, `onResolved` receives
 * the address parts so the form can populate sibling fields (logradouro/bairro/cidade/UF).
 * Note for the customer: this component makes an external call to viacep.com.br.
 */
export function CepInput({ id, value, onChange, onResolved }: {
  id: string;
  value: unknown;
  onChange: (v: string) => void;
  onResolved?: (addr: CepAddress) => void;
}) {
  async function resolve(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8 || !onResolved) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!res.ok) return;
      const body = await res.json();
      if (!body?.erro) onResolved(body as CepAddress);
    } catch {
      /* offline / blocked — the field still works as a plain masked input */
    }
  }

  const current = value === null || value === undefined ? "" : String(value);
  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      maxLength={CEP_MASK.length}
      placeholder="_____-___"
      value={current}
      onChange={(e) => onChange(applyMask(e.target.value, CEP_MASK))}
      onBlur={(e) => resolve(e.target.value)}
    />
  );
}
