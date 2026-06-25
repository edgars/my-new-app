'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

type Row = Record<string, unknown>;

export default function AvisosUsuarioPage() {
  const { data, error, isLoading } = useSWR<Row[]>('/avisos_usuarios', api);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load.</p>;
  return (
    <main>
      <h1>AvisosUsuarios</h1>
      <table>
        <thead><tr><th style={{ textAlign: 'left', padding: '4px 8px' }}>id</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>mensagem</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>perfil</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>data</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>itemIs</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>validado</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>ignorar</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>lancado</th><th style={{ textAlign: 'left', padding: '4px 8px' }}>ignorarChefia</th></tr></thead>
        <tbody>
          {(data ?? []).map((row, i) => (
            <tr key={i}><td style={{ padding: '4px 8px' }}>{String(row.id ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.mensagem ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.perfil ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.data ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.itemIs ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.validado ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.ignorar ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.lancado ?? '')}</td><td style={{ padding: '4px 8px' }}>{String(row.ignorarChefia ?? '')}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
