'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/query/keys';
import { Card } from '../../shared';
function useDiagnostics(){return useQuery({queryKey:queryKeys.diagnostics,queryFn:async()=>{const r=await fetch('/api/diagnostics'); if(!r.ok) throw new Error('Diagnostics failed'); return r.json();}})}
export function SettingsPage(){const{data:diag}=useDiagnostics();return <div className="grid"><Card><p className="eyebrow">Settings</p><p>Supabase configured: {diag?.supabaseConfigured?'yes':'no'} · Authenticated: {diag?.userAuthenticated?'yes':'no'} · AI: {diag?.aiProvider}</p><a className="btn secondary" href="/settings/diagnostics">Diagnostics</a><form action="/api/auth/logout" method="post"><button className="btn secondary">Sign out</button></form></Card><Card><p className="eyebrow">Install on iPhone</p><ol><li>Open in Safari.</li><li>Tap Share.</li><li>Tap Add to Home Screen.</li></ol></Card></div>}
export function DiagnosticsPage(){const{data:diag}=useDiagnostics();return <Card><p className="eyebrow">Diagnostics</p><pre>{JSON.stringify(diag,null,2)}</pre></Card>}
