import { getAccessToken } from '../auth/session';

type DbResult<T> = { data: T | null; error: { message: string; code?: string } | null };
export type UserDbClient = { request<T>(path: string, init?: RequestInit): Promise<T>; user: { id: string; email?: string } };

export async function createUserSupabaseClient(): Promise<UserDbClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = await getAccessToken();
  if (!url || !key) throw new Error('Supabase is not configured.');
  if (!token) throw new Error('You must be signed in.');
  const headers = { apikey: key, Authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const userRes = await fetch(`${url}/auth/v1/user`, { headers, cache: 'no-store' });
  const userJson = await userRes.json().catch(() => ({}));
  if (!userRes.ok || !userJson?.id) throw new Error('Authenticated session is invalid or expired. Please sign in again.');
  return { user: { id: userJson.id, email: userJson.email }, async request<T>(path: string, init: RequestInit = {}) { const res = await fetch(`${url}/rest/v1/${path}`, { ...init, cache: 'no-store', headers: { ...headers, Prefer: 'return=representation', ...(init.headers ?? {}) } }); const text = await res.text(); const data = text ? JSON.parse(text) : null; if (!res.ok) throw new Error(data?.message || data?.error || `Supabase request failed (${res.status})`); return data as T; } };
}
export function safeDbError(error: unknown) { const message = error instanceof Error ? error.message : 'Database request failed'; console.error(JSON.stringify({ level:'error', scope:'database', message })); return message; }
