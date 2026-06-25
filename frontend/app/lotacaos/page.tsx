'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

type Row = Record<string, unknown>;

export default function LotacaoPage() {
  const { data, error, isLoading } = useSWR<Row[]>('/lotacaos', api);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load.</p>;
  return (
    <main>
      <h1>Lotacaos</h1>
      <table>
        <thead><tr><th style={{ textAlign: 'left', padding: '4px 8px' }}>id</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>funcionarioAuxLookup</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>dataInicio</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>dataFim</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>atual</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>substituicao</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>ativo</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>obs</th></tr></thead>
        <tbody>
          {(data ?? []).map((row, i) => (
            <tr key={i}><td style={{ padding: '4px 8px' }}>{String(row.id ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.funcionarioAuxLookup ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.dataInicio ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.dataFim ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.atual ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.substituicao ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.ativo ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.obs ?? '')}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
