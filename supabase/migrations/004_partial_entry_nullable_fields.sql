alter table public.workout_sets add column if not exists notes text;
alter table public.workout_sets add column if not exists duration_seconds numeric;
alter table public.workout_sets add column if not exists distance_meters numeric;
alter table public.workout_sessions add column if not exists plan_id uuid references public.workout_plans(id) on delete set null;
