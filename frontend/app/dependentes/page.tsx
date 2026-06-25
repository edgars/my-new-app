'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

type Row = Record<string, unknown>;

export default function DependentePage() {
  const { data, error, isLoading } = useSWR<Row[]>('/dependentes', api);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load.</p>;
  return (
    <main>
      <h1>Dependentes</h1>
      <table>
        <thead><tr><th style={{ textAlign: 'left', padding: '4px 8px' }}>id</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>nome</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>dataNascimento</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>parentesco</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>cpf</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>sexo</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>dadosBancarios</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>documentos</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>endereco</th></tr></thead>
        <tbody>
          {(data ?? []).map((row, i) => (
            <tr key={i}><td style={{ padding: '4px 8px' }}>{String(row.id ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.nome ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.dataNascimento ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.parentesco ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.cpf ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.sexo ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.dadosBancarios ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.documentos ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.endereco ?? '')}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
