# Super App

Mobile-first health and fitness PWA for workouts, nutrition, body metrics, recovery, reports and an AI coach. It runs in demo mode without Supabase/OpenRouter and switches to production mode when valid Supabase public credentials are present.

## Screenshots

Add production screenshots after deployment.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Demo mode

Leave `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` empty. The app uses browser storage and deterministic demo data. No external requests to Supabase are attempted.

## Supabase setup

1. Create a Supabase project at supabase.com.
2. Open Project Settings → API and copy the Project URL to `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the publishable anon key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the secret service-role key to `SUPABASE_SERVICE_ROLE_KEY` only in server environments such as Vercel; never expose it to the browser.
5. Run `supabase/migrations/001_initial_schema.sql` and then `supabase/migrations/002_rls_policies_and_profile_init.sql` in the Supabase SQL editor or CLI.
6. Enable Email authentication in Supabase Auth.
7. Configure redirect URLs for local development and Vercel, for example `http://localhost:3000` and your `NEXT_PUBLIC_APP_URL`.
8. Register a user at `/register`, then sign in at `/login`.

## OpenRouter setup

1. Set `AI_PROVIDER=openrouter`.
2. Set `OPENROUTER_API_KEY` server-side.
3. Set `OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`.
4. Set `OPENROUTER_APP_NAME=Super App` and optionally `OPENROUTER_SITE_URL`.
5. Set model roles. Free model placeholders can use `openrouter/free` for `AI_FAST_MODEL`, `AI_REASONING_MODEL`, `AI_VISION_MODEL`, and `AI_FALLBACK_MODEL`.
6. If OpenRouter rate limits or free-model unavailability occurs, choose a different model ID or temporarily use `AI_PROVIDER=mock` for demos.

## Vercel deployment

Use the Next.js framework preset, repository root, default output directory and `npm run build`. Add all production environment variables in Vercel Project Settings and redeploy after every environment change.

## Diagnostics

Open `/settings/diagnostics`. It shows mode, Supabase status, authentication status, AI provider, OpenRouter configured status, model IDs, notification capability and sync state without exposing secrets.

## PWA installation on iPhone

Open the deployed site in Safari, tap Share, tap Add to Home Screen, then launch the installed app.

## Morning analysis

`POST /api/cron/morning-analysis` runs deterministic signal detection. If `CRON_SECRET` is configured, pass `Authorization: Bearer <secret>`. Settings includes a manual demo action.

## Discord setup

Set `DISCORD_WEBHOOK_URL` server-side. Missing Discord configuration returns a controlled status and never breaks the app.

## Troubleshooting

- Blank page: verify Vercel built a commit containing `next` in `package.json`, App Router files and `vercel.json`.
- RLS errors: ensure migration `002_rls_policies_and_profile_init.sql` ran and rows use the authenticated user's `user_id`.
- Authentication errors: confirm email auth is enabled and redirect URLs match your domain.
- OpenRouter errors: verify `OPENROUTER_API_KEY`, model role IDs and provider rate limits.

## Tests

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Switching AI providers

Use `AI_PROVIDER=mock` for deterministic local responses or `AI_PROVIDER=openrouter` for real OpenRouter responses. UI code calls `/api/ai/chat`; secrets remain server-side.

See `docs/production-setup.md` for the production checklist.

## Functional persistence update

The primary root cause for “Supabase configured/authenticated but zero rows” was that production UI pages wrote almost exclusively to `localStorage` demo keys and never called Supabase for body, food, recovery, or workout mutations. A second root cause was that the browser Supabase helper was only a config object, so repositories/API routes had no authenticated CRUD client and errors were hidden behind demo-style optimistic state. The corrective implementation routes production mutations through authenticated server API routes that derive `user_id` from the Supabase access-token cookie and map camelCase UI fields to snake_case database columns.

Run the migrations in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies_and_profile_init.sql`
3. `supabase/migrations/003_functional_app_persistence.sql`

The third migration adds missing columns for editable food/settings/workout fields, updated-at triggers, uniqueness constraints for daily recovery and active workouts, and private `meal-photos` / `progress-photos` Storage buckets with owner-only policies. No manual table creation is required beyond applying these migrations.

Current completed end-to-end flows:

- Body measurements: create, edit, delete, Supabase persistence, refresh-backed reload.
- Manual food logs: create, edit, delete, nutrition totals, explicit editable AI draft before save.
- Recovery check-ins: editable fields, deterministic readiness, save to Supabase.
- Active workouts: start, add exercises/sets, edit weight/reps/RPE, save active workout, finish, history, delete.
- Settings/diagnostics retain safe status reporting without exposing secrets.

Known remaining limitations: full OpenRouter vision upload/analysis, IndexedDB sync conflict resolution, notifications, reports history, habit CRUD, and generated workout-plan drafts still need follow-up implementation before the broader product definition of done is fully complete.
