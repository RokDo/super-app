import { AIError } from "./errors.js";
export type AIProviderName = "openrouter" | "openai-compatible" | "mock";
const bool = (v: string | undefined, d: boolean) => v == null || v === "" ? d : v === "true";
const num = (v: string | undefined) => v ? Number(v) : undefined;
export function getAIConfig(env = process.env) {
  const provider = (env.AI_PROVIDER || "openrouter") as AIProviderName;
  return { provider, requestTimeoutMs: Number(env.AI_REQUEST_TIMEOUT_MS || 45000), maxRetries: Number(env.AI_MAX_RETRIES || 1), dailyBudgetUsd: num(env.AI_DAILY_BUDGET_USD), monthlyBudgetUsd: num(env.AI_MONTHLY_BUDGET_USD), logPrompts: bool(env.AI_LOG_PROMPTS, false), mockScenario: env.AI_MOCK_SCENARIO || "normal",
    openrouter: { apiKey: env.OPENROUTER_API_KEY, baseUrl: env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1", siteUrl: env.OPENROUTER_SITE_URL, appName: env.OPENROUTER_APP_NAME, allowFallbacks: bool(env.OPENROUTER_ALLOW_FALLBACKS, true), requireParameters: bool(env.OPENROUTER_REQUIRE_PARAMETERS, true), dataCollection: (env.OPENROUTER_DATA_COLLECTION || "deny") as "allow" | "deny", zeroDataRetentionOnly: bool(env.OPENROUTER_ZDR_ONLY, false), providerOrder: env.OPENROUTER_PROVIDER_ORDER?.split(",").map(s => s.trim()).filter(Boolean), maxPromptPrice: num(env.OPENROUTER_MAX_PROMPT_PRICE), maxCompletionPrice: num(env.OPENROUTER_MAX_COMPLETION_PRICE) },
    openAICompatible: { baseUrl: env.OPENAI_COMPATIBLE_BASE_URL, apiKey: env.OPENAI_COMPATIBLE_API_KEY } };
}
export function validateAIEnvironment(env = process.env) { const cfg = getAIConfig(env); if (cfg.provider === "openrouter" && !cfg.openrouter.apiKey) throw new AIError("AUTHENTICATION_FAILED", "OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter"); return cfg; }
