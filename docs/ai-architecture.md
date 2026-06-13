# AI Architecture

The app uses a provider-independent AI service exposed from `lib/ai/index.ts`. Product code calls `ai.generateText`, `ai.generateStructured`, or `ai.streamText`; it must not import OpenRouter, OpenAI, Anthropic, Gemini, or provider request types.

Provider selection is centralized in `lib/ai/providers/provider.ts`. OpenRouter is the default initial gateway, with mock and OpenAI-compatible adapters available for tests and future deployments.

Models are selected by role (`fast`, `reasoning`, `vision`, `fallback`) through `lib/ai/models.ts`; feature code never hard-codes model identifiers.
