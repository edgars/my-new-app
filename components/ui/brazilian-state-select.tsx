"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// The 27 Brazilian federative units — static, no network. Value stored is the UF sigla ("SP"),
// matching how legacy systems persist state columns.
export const BRAZILIAN_UFS: { sigla: string; nome: string }[] = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export function BrazilianStateSelect({ value, onChange }: {
  value: unknown;
  onChange: (v: string | null) => void;
}) {
  const has = value !== null && value !== undefined && value !== "";
  return (
    <Select value={has ? String(value).toUpperCase() : ""} onValueChange={(v) => { if (v) onChange(v); }}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione a UF…" />
      </SelectTrigger>
      <SelectContent>
        {BRAZILIAN_UFS.map((uf) => (
          <SelectItem key={uf.sigla} value={uf.sigla}>
            {uf.sigla} — {uf.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
