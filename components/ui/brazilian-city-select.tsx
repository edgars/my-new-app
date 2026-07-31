"use client";
import useSWR from "swr";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Municipalities of the selected UF, from the public IBGE localidades API (no key required).
// Note for the customer: this component makes an external call to servicodados.ibge.gov.br.
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function BrazilianCitySelect({ uf, value, onChange }: {
  uf: string | null | undefined;
  value: unknown;
  onChange: (v: string | null) => void;
}) {
  const ufCode = uf ? String(uf).toUpperCase() : null;
  const { data, isLoading } = useSWR(
    ufCode ? `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCode}/municipios?orderBy=nome` : null,
    fetcher,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cities: any[] = Array.isArray(data) ? data : [];
  const has = value !== null && value !== undefined && value !== "";
  const current = has ? String(value) : "";
  // A stored city not present in the IBGE list (typo in the legacy data) must still display.
  const known = cities.some((c) => c.nome === current);

  // Radix can fire onValueChange("") while the option list is (re)loading — and since no item
  // carries an empty value, "" is never a real user pick: ignore it (it was wiping the city the
  // ViaCEP auto-fill had just set).
  return (
    <Select value={current} onValueChange={(v) => { if (v) onChange(v); }} disabled={!ufCode}>
      <SelectTrigger>
        <SelectValue placeholder={!ufCode ? "Selecione a UF primeiro" : isLoading ? "Carregando municípios…" : "Selecione a cidade…"}>
          {has ? current : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {has && !known && <SelectItem value={current}>{current}</SelectItem>}
        {cities.map((c) => (
          <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
