-- Exercise library and manual workout-plan system enhancements.
alter table public.exercises add column if not exists name_normalized text;
alter table public.exercises add column if not exists primary_muscle_group text;
alter table public.exercises add column if not exists secondary_muscle_groups text[] default '{}';
alter table public.exercises add column if not exists notes text;
alter table public.exercises add column if not exists default_rest_seconds int;
alter table public.exercises add column if not exists unilateral boolean default false;
alter table public.exercises add column if not exists measurement_type text default 'weight and reps';
alter table public.exercises add column if not exists archived boolean default false;
update public.exercises set name_normalized = lower(regexp_replace(trim(name), '[^a-z0-9]+', ' ', 'g')) where name_normalized is null;
update public.exercises set primary_muscle_group = coalesce(primary_muscle_group, muscle_group) where primary_muscle_group is null;
create unique index if not exists exercises_user_normalized_name_idx on public.exercises(user_id, name_normalized);
create index if not exists exercises_user_muscle_equipment_idx on public.exercises(user_id, primary_muscle_group, equipment) where archived = false;

alter table public.workout_plans add column if not exists goal text;
alter table public.workout_plans add column if not exists archived boolean default false;
alter table public.workout_plans add column if not exists created_at timestamptz default now();
alter table public.workout_plans add column if not exists updated_at timestamptz default now();
create unique index if not exists workout_plans_one_active_per_user on public.workout_plans(user_id) where active = true and archived = false;
create index if not exists workout_plans_user_status_idx on public.workout_plans(user_id, active, archived);

alter table public.workout_plan_days add column if not exists position int default 0;
alter table public.workout_plan_days add column if not exists created_at timestamptz default now();
alter table public.workout_plan_days add column if not exists updated_at timestamptz default now();
create index if not exists workout_plan_days_plan_position_idx on public.workout_plan_days(plan_id, position);

alter table public.workout_plan_exercises add column if not exists exercise_id uuid references public.exercises(id) on delete set null;
alter table public.workout_plan_exercises add column if not exists min_reps int;
alter table public.workout_plan_exercises add column if not exists max_reps int;
alter table public.workout_plan_exercises add column if not exists progression_type text;
alter table public.workout_plan_exercises add column if not exists notes text;
alter table public.workout_plan_exercises add column if not exists alternatives text[] default '{}';
alter table public.workout_plan_exercises add column if not exists archived boolean default false;
update public.workout_plan_exercises set min_reps = nullif(split_part(target_reps, '-', 1), '')::int where min_reps is null and target_reps ~ '^[0-9]+-[0-9]+$';
update public.workout_plan_exercises set max_reps = nullif(split_part(target_reps, '-', 2), '')::int where max_reps is null and target_reps ~ '^[0-9]+-[0-9]+$';
create index if not exists workout_plan_exercises_day_position_idx on public.workout_plan_exercises(day_id, position) where archived = false;
create index if not exists workout_plan_exercises_exercise_idx on public.workout_plan_exercises(exercise_id);

alter table public.workout_sessions add column if not exists plan_day_id uuid references public.workout_plan_days(id) on delete set null;
alter table public.workout_session_exercises add column if not exists exercise_id uuid references public.exercises(id) on delete set null;
alter table public.workout_session_exercises add column if not exists planned_sets int;
alter table public.workout_session_exercises add column if not exists planned_min_reps int;
alter table public.workout_session_exercises add column if not exists planned_max_reps int;
alter table public.workout_session_exercises add column if not exists planned_rpe numeric;
alter table public.workout_session_exercises add column if not exists planned_rest_seconds int;
create index if not exists workout_session_exercises_exercise_idx on public.workout_session_exercises(exercise_id);
