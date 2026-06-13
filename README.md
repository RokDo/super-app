# Super App

A mobile-first health and fitness PWA for training, nutrition, body metrics, recovery, reports and an AI coach. The app opens in demo mode without Supabase or OpenRouter credentials, so Vercel deployments do not blank-screen when optional integrations are missing.

## Screenshots

Add production screenshots here after the first deployed build.

## Local setup

```bash
npm install
npm run dev
```

## Demo mode

If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, the app uses browser storage and realistic demo data. Workout, food, body and recovery screens remain usable.

## Supabase setup

1. Create a Supabase project.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
4. Run SQL in `supabase/migrations/001_initial_schema.sql`.

## OpenRouter setup

Set `AI_PROVIDER=openrouter`, `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, and model role variables. If the key is absent, AI routes fall back to deterministic mock responses.

## Vercel deployment

Use the Next.js framework preset, repository root, default output directory and `npm run build`. See `docs/vercel-deployment.md` if Vercel says it cannot detect Next.js.

## Environment variables

Copy `.env.example` to `.env.local`. Real values are required only for production integrations: Supabase keys, OpenRouter key/model roles, Discord webhook, VAPID keys and cron secret.

## PWA installation on iPhone

Open the site in Safari, tap Share, tap Add to Home Screen, then launch the installed app.

## Morning analysis

`POST /api/cron/morning-analysis` runs deterministic signal detection and can be protected with `CRON_SECRET`. Settings also includes a demo action.

## Discord setup

Set `DISCORD_WEBHOOK_URL` server-side. Missing Discord configuration never breaks the app.

## Troubleshooting blank pages

The root page renders the Today dashboard in demo mode. If Vercel is blank, verify it deployed a commit containing `next` in `package.json`, App Router files, and `vercel.json`.

## Tests

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Switch AI provider

Use `AI_PROVIDER=mock` for local deterministic AI or `AI_PROVIDER=openrouter` for OpenRouter. UI code calls provider-neutral app APIs only.
