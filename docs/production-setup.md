# Production setup checklist

1. Create a Supabase project and copy the Project URL.
2. Copy the publishable anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY` only in server environments.
4. Run `supabase/migrations/001_initial_schema.sql` and then `002_rls_policies_and_profile_init.sql`.
5. Enable Supabase email authentication and add local/Vercel redirect URLs.
6. Set Vercel environment variables from `.env.example` without committing secrets.
7. Configure OpenRouter with `AI_PROVIDER=openrouter`, `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, and model role IDs such as `openrouter/free`.
8. Redeploy after environment changes.
9. Test registration, login, logout, diagnostics, coach chat, and RLS by using two different users.
10. For OpenRouter rate limits, switch to another configured model role or temporarily use `AI_PROVIDER=mock` for demos.

## Security checklist

- Browser code receives only `NEXT_PUBLIC_*` values.
- Server routes never return API keys or service-role keys.
- RLS policies require `auth.uid() = user_id` for every user-owned table.
- Cron requests require `CRON_SECRET` when configured.
- AI prompts are size-limited and contain only summarized user-approved context.
