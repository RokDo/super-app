import { createOpenRouterProvider } from "./openrouter";
export function createOpenAICompatibleProvider(env = process.env) { return createOpenRouterProvider({ ...env, AI_PROVIDER: "openai-compatible", OPENROUTER_API_KEY: env.OPENAI_COMPATIBLE_API_KEY, OPENROUTER_BASE_URL: env.OPENAI_COMPATIBLE_BASE_URL }); }
