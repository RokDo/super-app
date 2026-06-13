export type AppMode='demo'|'production';
const validUrl=(v?:string)=>!!v&&/^https?:\/\//.test(v);
export function getPublicEnv(){const supabaseConfigured=validUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)&&!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;return{mode:(supabaseConfigured?'production':'demo') as AppMode,supabaseConfigured,appUrl:process.env.NEXT_PUBLIC_APP_URL??'',aiProvider:process.env.AI_PROVIDER??'mock',openRouterConfigured:!!process.env.OPENROUTER_API_KEY}}
export function getServerEnv(){return{...getPublicEnv(),cronSecret:process.env.CRON_SECRET,discordConfigured:!!process.env.DISCORD_WEBHOOK_URL}}
