# Adding an AI Provider

1. Implement the `AIProvider` interface (`generateText`, `generateStructured`, `streamText`, and `supports`).
2. Normalize internal messages into the provider's message format inside the adapter only.
3. Normalize streaming into `AIStreamEvent` objects: text deltas, tool status, usage, complete, and error.
4. Support structured outputs with JSON Schema when possible, then validate again with Zod.
5. Map internal tool definitions to provider tool/function calling without exposing arbitrary database access.
6. Report token usage and provider or estimated cost in `AIUsage`.
7. Reuse provider contract tests for the adapter and add provider-specific normalization tests.
8. Register the adapter in `createAIProvider` in `lib/ai/providers/provider.ts`.
9. Switch providers through environment variables such as `AI_PROVIDER` and provider-specific base URL/API key settings.
