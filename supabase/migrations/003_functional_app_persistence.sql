-- Corrective migration for functional CRUD, settings, storage, uniqueness, and active workout persistence.
alter table public.food_logs add column if not exists serving_size numeric;
alter table public.food_logs add column if not exists serving_unit text;
alter table public.food_logs add column if not exists amount numeric;
alter table public.food_logs add column if not exists notes text;
alter table public.food_logs add column if not exists photo_path text;
alter table public.food_logs add column if not exists created_at timestamptz default now();
alter table public.food_logs add column if not exists updated_at timestamptz default now();
alter table public.nutrition_targets add column if not exists fiber numeric;
alter table public.nutrition_targets add column if not exists water_ml int;
alter table public.profiles add column if not exists goal_type text;
alter table public.profiles add column if not exists goal_weight_kg numeric;
alter table public.profiles add column if not exists timezone text default 'UTC';
alter table public.profiles add column if not exists week_start_day text default 'monday';
alter table public.profiles add column if not exists updated_at timestamptz default now();
alter table public.exercises add column if not exists muscle_group text;
alter table public.exercises add column if not exists equipment text;
alter table public.exercises add column if not exists category text;
alter table public.exercises add column if not exists instructions text;
alter table public.exercises add column if not exists created_at timestamptz default now();
alter table public.exercises add column if not exists updated_at timestamptz default now();
alter table public.workout_sessions add column if not exists active boolean generated always as (finished_at is null) stored;
alter table public.workout_sessions add column if not exists updated_at timestamptz default now();
alter table public.workout_session_exercises add column if not exists notes text;
alter table public.workout_sets add column if not exists completed boolean default false;
alter table public.workout_sets add column if not exists created_at timestamptz default now();
alter table public.workout_sets add column if not exists updated_at timestamptz default now();
alter table public.body_measurements add column if not exists created_at timestamptz default now();
alter table public.body_measurements add column if not exists updated_at timestamptz default now();
alter table public.recovery_checkins add column if not exists created_at timestamptz default now();
alter table public.recovery_checkins add column if not exists updated_at timestamptz default now();

create unique index if not exists recovery_checkins_one_per_user_day on public.recovery_checkins(user_id, checked_at);
create unique index if not exists daily_insights_one_per_user_day on public.daily_insights(user_id, insight_date);
create unique index if not exists workout_sessions_one_active_per_user on public.workout_sessions(user_id) where finished_at is null;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
do $$ declare t text; begin
  foreach t in array array['profiles','exercises','workout_sessions','workout_sets','food_logs','body_measurements','recovery_checkins'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

insert into storage.buckets (id, name, public) values ('meal-photos','meal-photos',false) on conflict (id) do update set public=false;
insert into storage.buckets (id, name, public) values ('progress-photos','progress-photos',false) on conflict (id) do update set public=false;

drop policy if exists meal_photos_select_own on storage.objects;
drop policy if exists meal_photos_insert_own on storage.objects;
drop policy if exists meal_photos_update_own on storage.objects;
drop policy if exists meal_photos_delete_own on storage.objects;
create policy meal_photos_select_own on storage.objects for select to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy meal_photos_insert_own on storage.objects for insert to authenticated with check (bucket_id='meal-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy meal_photos_update_own on storage.objects for update to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='meal-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy meal_photos_delete_own on storage.objects for delete to authenticated using (bucket_id='meal-photos' and (storage.foldername(name))[1]=auth.uid()::text);

drop policy if exists progress_photos_select_own on storage.objects;
drop policy if exists progress_photos_insert_own on storage.objects;
drop policy if exists progress_photos_update_own on storage.objects;
drop policy if exists progress_photos_delete_own on storage.objects;
create policy progress_photos_select_own on storage.objects for select to authenticated using (bucket_id='progress-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy progress_photos_insert_own on storage.objects for insert to authenticated with check (bucket_id='progress-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy progress_photos_update_own on storage.objects for update to authenticated using (bucket_id='progress-photos' and (storage.foldername(name))[1]=auth.uid()::text) with check (bucket_id='progress-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy progress_photos_delete_own on storage.objects for delete to authenticated using (bucket_id='progress-photos' and (storage.foldername(name))[1]=auth.uid()::text);
