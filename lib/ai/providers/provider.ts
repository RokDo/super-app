import type { AIProvider } from "../types";
import { getAIConfig } from "../config";
import { createOpenRouterProvider } from "./openrouter";
import { createMockProvider } from "./mock";
import { createOpenAICompatibleProvider } from "./openai-compatible";
import { AIError } from "../errors";
export function createAIProvider(env: Record<string, string | undefined> = process.env): AIProvider { switch (getAIConfig(env).provider) { case "openrouter": return createOpenRouterProvider(env); case "openai-compatible": return createOpenAICompatibleProvider(env); case "mock": return createMockProvider(env); default: throw new AIError("UNKNOWN", "Unsupported AI provider"); } }
