export type AIErrorCode = "AUTHENTICATION_FAILED" | "RATE_LIMITED" | "MODEL_UNAVAILABLE" | "PROVIDER_UNAVAILABLE" | "INVALID_STRUCTURED_OUTPUT" | "TIMEOUT" | "CONTENT_REJECTED" | "BUDGET_EXCEEDED" | "UNSUPPORTED_CAPABILITY" | "UNKNOWN";
export class AIError extends Error { constructor(public code: AIErrorCode, message: string, public cause?: unknown) { super(message); this.name = "AIError"; } }
export function toAIError(error: unknown): AIError { return error instanceof AIError ? error : new AIError("UNKNOWN", error instanceof Error ? error.message : "Unknown AI error", error); }
