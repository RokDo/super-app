import type { ZodSchema } from "zod";
import { createAIProvider } from "./providers/provider";
import type { AIRequestOptions } from "./types";
export class AIClient { constructor(private provider = createAIProvider()) {} generateText(options: AIRequestOptions) { return this.provider.generateText(options); } generateStructured<T>(options: AIRequestOptions, schema: ZodSchema<T>) { return this.provider.generateStructured(options, schema); } streamText(options: AIRequestOptions) { return this.provider.streamText(options); } }
export const ai = new AIClient();
