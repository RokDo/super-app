export type AppMode = 'demo' | 'production';
const validUrl = (v?: string) => !!v && /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(v);
const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export function getPublicEnv() {
  const supabaseConfigured = validUrl(publicSupabaseUrl) && !!publicSupabaseAnonKey;
  return {
    mode: (supabaseConfigured ? 'production' : 'demo') as AppMode,
    supabaseConfigured,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? '',
    aiProvider: process.env.AI_PROVIDER ?? 'mock',
    openRouterConfigured: !!process.env.OPENROUTER_API_KEY,
    models: {
      fast: process.env.AI_FAST_MODEL ?? 'openrouter/free',
      reasoning: process.env.AI_REASONING_MODEL ?? 'openrouter/free',
      vision: process.env.AI_VISION_MODEL ?? 'openrouter/free',
      fallback: process.env.AI_FALLBACK_MODEL ?? 'openrouter/free',
    },
    diagnostics: {
      supabaseUrlValid: validUrl(publicSupabaseUrl),
      hasAnonKey: !!publicSupabaseAnonKey,
    },
  };
}
export function getServerEnv() {
  return {
    ...getPublicEnv(),
    supabaseServiceRoleConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    cronSecret: process.env.CRON_SECRET,
    cronSecretConfigured: !!process.env.CRON_SECRET,
    discordConfigured: !!process.env.DISCORD_WEBHOOK_URL,
    vapidConfigured: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && !!process.env.VAPID_PRIVATE_KEY && !!process.env.VAPID_SUBJECT,
  };
}
