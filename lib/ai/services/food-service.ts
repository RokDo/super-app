import { ai } from "../client.js";
import { FoodAnalysisSchema } from "../schemas.js";
import type { AIMessage } from "../types.js";
export function analyzeFood(messages: AIMessage[]) { return ai.generateStructured({ modelRole: "vision", messages, requiredCapabilities: ["vision", "structuredOutput"], metadata: { feature: "food-analysis" } }, FoodAnalysisSchema); }
