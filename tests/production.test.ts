import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import { getPublicEnv } from '../lib/config/env';
import { createOpenRouterProvider } from '../lib/ai/providers/openrouter';

describe('production readiness', () => {
  const original = { ...process.env };
  beforeEach(() => { vi.restoreAllMocks(); process.env = { ...original }; });
  afterEach(() => { process.env = original; });

  it('detects production mode with valid Supabase public env', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    expect(getPublicEnv()).toMatchObject({ mode: 'production', supabaseConfigured: true });
  });

  it('OpenRouter adapter sends configured headers and model', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 'r1', model: 'openrouter/free', choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }] }) }));
    const provider = createOpenRouterProvider({ AI_PROVIDER: 'openrouter', OPENROUTER_API_KEY: 'secret', OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1', OPENROUTER_SITE_URL: 'https://app.example.com', OPENROUTER_APP_NAME: 'Super App', AI_REASONING_MODEL: 'openrouter/free', AI_FAST_MODEL: 'openrouter/free', AI_FALLBACK_MODEL: 'openrouter/free' } as unknown as NodeJS.ProcessEnv);
    await provider.generateText({ modelRole: 'reasoning', messages: [{ role: 'user', content: 'hello' }] });
    const [, init] = (fetch as any).mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer secret');
    expect(init.headers['HTTP-Referer']).toBe('https://app.example.com');
    expect(JSON.parse(init.body).model).toBe('openrouter/free');
  });

  it('RLS migration contains owner policies and auth trigger', () => {
    const sql = fs.readFileSync('supabase/migrations/002_rls_policies_and_profile_init.sql', 'utf8');
    expect(sql).toContain('handle_new_user');
    expect(sql).toContain('auth.uid() = user_id');
    expect(sql).toContain('create_owner_policies');
  });
});
