import type { ZodSchema } from "zod";

export type JSONSchema = Record<string, unknown>;
export type AIContentPart = { type: "text"; text: string } | { type: "image"; url: string; mimeType?: string };
export type AIMessage = { role: "system" | "user" | "assistant" | "tool"; content: string | AIContentPart[]; name?: string; toolCallId?: string };
export type AIModelRole = "fast" | "reasoning" | "vision" | "fallback";
export type AICapability = "tools" | "structuredOutput" | "vision" | "streaming";
export type AIToolDefinition = { name: string; description: string; parameters: JSONSchema };
export type AIRequestOptions = { modelRole: AIModelRole; messages: AIMessage[]; temperature?: number; maxOutputTokens?: number; responseSchema?: JSONSchema; tools?: AIToolDefinition[]; stream?: boolean; timeoutMs?: number; metadata?: Record<string, string>; requiredCapabilities?: AICapability[] };
export type AIUsage = { inputTokens?: number; outputTokens?: number; totalTokens?: number; estimatedCostUsd?: number; providerReportedCostUsd?: number };
export type AIResponse<T = string> = { id?: string; provider: string; model: string; content: T; finishReason?: string; usage?: AIUsage; rawProviderMetadata?: Record<string, unknown> };
export type AIStreamEvent = { type: "text-delta"; text: string } | { type: "tool-status"; name: string; status: string } | { type: "usage"; usage: AIUsage } | { type: "complete" } | { type: "error"; message: string };
export interface AIProvider { generateText(options: AIRequestOptions): Promise<AIResponse<string>>; generateStructured<T>(options: AIRequestOptions, schema: ZodSchema<T>): Promise<AIResponse<T>>; streamText(options: AIRequestOptions): Promise<ReadableStream<AIStreamEvent>>; supports(capability: AICapability): boolean; }
