# AI Cost Controls

Record usage events with user, feature, provider, model, token counts, estimated/provider cost, latency, success state, and error category. Do not store full prompts by default; use template names and hashes.

Daily and monthly budgets are enforced before optional AI features run. If a hard limit is reached, deterministic tracking continues and AI features return graceful unavailable states or deterministic summaries.
