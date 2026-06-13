import { ai } from "../client";
import { FoodAnalysisSchema } from "../schemas";
import type { AIMessage } from "../types";
export function analyzeFood(messages: AIMessage[]) { return ai.generateStructured({ modelRole: "vision", messages, requiredCapabilities: ["vision", "structuredOutput"], metadata: { feature: "food-analysis" } }, FoodAnalysisSchema); }
