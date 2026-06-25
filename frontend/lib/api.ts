const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function api<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
