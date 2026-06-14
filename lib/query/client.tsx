'use client';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { idbGet, idbPut } from '../repositories/browser-db';
import { repositories } from '../repositories/factory';
import { queryKeys } from './keys';

const CACHE_ID = 'tanstack-query-cache';
const shouldPersist = (key: QueryKey) => ['food-logs','body-measurements','recovery-checkins','workouts','workout-plans','exercises','settings','nutrition-targets'].includes(String(key[0]));
export function makeQueryClient(){ return new QueryClient({ defaultOptions:{ queries:{ staleTime: 5*60*1000, gcTime: 24*60*60*1000, retry: 1, refetchOnReconnect: true, refetchOnMount: false, refetchOnWindowFocus: false }, mutations:{ retry: 0 } } }); }
async function restore(client: QueryClient){ const cached = await idbGet<{id:string;queries:{key:QueryKey;data:unknown;updatedAt:number}[]}>('query-cache', CACHE_ID); cached?.queries.forEach((q)=>client.setQueryData(q.key, q.data, { updatedAt:q.updatedAt })); }
async function persist(client: QueryClient){ const queries=client.getQueryCache().getAll().filter(q=>q.state.status==='success' && shouldPersist(q.queryKey)).map(q=>({key:q.queryKey,data:q.state.data,updatedAt:q.state.dataUpdatedAt})); await idbPut('query-cache',{id:CACHE_ID,queries}); }
function Prefetcher(){ const qc=useQueryClient(); useEffect(()=>{ void Promise.all([ qc.prefetchQuery({queryKey:queryKeys.foodLogs, queryFn:()=>repositories.foods.list()}), qc.prefetchQuery({queryKey:queryKeys.bodyMeasurements, queryFn:()=>repositories.body.list()}), qc.prefetchQuery({queryKey:queryKeys.recoveryCheckins, queryFn:()=>repositories.recovery.list()}), qc.prefetchQuery({queryKey:queryKeys.workouts, queryFn:()=>repositories.workouts.list()}), qc.prefetchQuery({queryKey:queryKeys.workoutPlans, queryFn:()=>repositories.workoutPlans.list()}), qc.prefetchQuery({queryKey:queryKeys.exercises, queryFn:()=>repositories.exercises.list()}), qc.prefetchQuery({queryKey:queryKeys.settings, queryFn:()=>repositories.settings.get()}), qc.prefetchQuery({queryKey:queryKeys.nutritionTargets, queryFn:()=>repositories.nutritionTargets.get()}), ]); },[qc]); return null; }
export function AppQueryProvider({children}:{children:ReactNode}){ const client=useMemo(()=>makeQueryClient(),[]); const [ready,setReady]=useState(false); useEffect(()=>{ restore(client).finally(()=>setReady(true)); const unsub=client.getQueryCache().subscribe(()=>{ window.clearTimeout((window as any).__superPersistTimer); (window as any).__superPersistTimer=window.setTimeout(()=>void persist(client),500); }); return unsub; },[client]); if(!ready) return null; return <QueryClientProvider client={client}><Prefetcher/>{children}</QueryClientProvider>; }
