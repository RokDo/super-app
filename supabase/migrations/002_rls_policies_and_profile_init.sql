create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))) on conflict (user_id) do nothing;
  insert into public.user_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.nutrition_targets (user_id, calories, protein, carbohydrates, fat) values (new.id, 2400, 160, 260, 75) on conflict (user_id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create or replace function public.create_owner_policies(tab text) returns void language plpgsql as $$
begin
  execute format('create policy if not exists %I_select_own on public.%I for select to authenticated using (auth.uid() = user_id)', tab, tab);
  execute format('create policy if not exists %I_insert_own on public.%I for insert to authenticated with check (auth.uid() = user_id)', tab, tab);
  execute format('create policy if not exists %I_update_own on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', tab, tab);
  execute format('create policy if not exists %I_delete_own on public.%I for delete to authenticated using (auth.uid() = user_id)', tab, tab);
end $$;
select public.create_owner_policies(t) from unnest(array['profiles','user_preferences','exercises','workout_plans','workout_plan_days','workout_plan_exercises','workout_sessions','workout_session_exercises','workout_sets','foods','meals','meal_items','food_logs','nutrition_targets','water_logs','body_measurements','recovery_checkins','readiness_scores','habits','habit_logs','ai_conversations','ai_messages','ai_actions','daily_insights','generated_reports']) as t;
create index if not exists workout_sessions_user_started_idx on public.workout_sessions(user_id, started_at desc);
create index if not exists food_logs_user_logged_idx on public.food_logs(user_id, logged_at desc);
create index if not exists body_measurements_user_measured_idx on public.body_measurements(user_id, measured_at desc);
create index if not exists recovery_checkins_user_checked_idx on public.recovery_checkins(user_id, checked_at desc);
create index if not exists ai_messages_user_conversation_idx on public.ai_messages(user_id, conversation_id, created_at);
