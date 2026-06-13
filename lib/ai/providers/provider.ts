import type { AIProvider } from "../types.js";
import { getAIConfig } from "../config.js";
import { createOpenRouterProvider } from "./openrouter.js";
import { createMockProvider } from "./mock.js";
import { createOpenAICompatibleProvider } from "./openai-compatible.js";
import { AIError } from "../errors.js";
export function createAIProvider(env = process.env): AIProvider { switch (getAIConfig(env).provider) { case "openrouter": return createOpenRouterProvider(env); case "openai-compatible": return createOpenAICompatibleProvider(env); case "mock": return createMockProvider(env); default: throw new AIError("UNKNOWN", "Unsupported AI provider"); } }
