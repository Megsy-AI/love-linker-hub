/** @doc Server-only loader for the text-provider (abliteration) API key.
 *  Keys live in the database (`abliteration_keys`, plus the shared
 *  `provider_api_keys` pool with provider "d"). Env vars are only a fallback.
 *  Never import this from client code.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const CACHE_MS = 60_000;
let cached: { key: string; at: number } | null = null;

function envKey(): string {
  return (
    process.env.ABLITERATION_API_KEY ||
    process.env.VITE_ABLITERATION_API_KEY ||
    ""
  ).trim();
}

function adminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** Active key from the DB pool (priority desc, least-recently-used), else env. */
export async function getAbliterationKey(): Promise<string> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.key;

  const supabase = adminClient();
  if (supabase) {
    const now = Date.now();
    const rows: Array<{ api_key: string; priority: number; last_used_at: string | null }> = [];

    const { data: dedicated } = await supabase
      .from("abliteration_keys")
      .select("api_key,priority,last_used_at,cooldown_until")
      .eq("status", "active");
    for (const r of (dedicated ?? []) as Array<Record<string, unknown>>) {
      const cd = r.cooldown_until as string | null;
      if (cd && new Date(cd).getTime() > now) continue;
      rows.push({
        api_key: String(r.api_key ?? ""),
        priority: Number(r.priority ?? 0),
        last_used_at: (r.last_used_at as string | null) ?? null,
      });
    }

    const { data: pool } = await supabase
      .from("provider_api_keys")
      .select("api_key,last_used_at")
      .eq("provider", "d")
      .eq("status", "active");
    for (const r of (pool ?? []) as Array<Record<string, unknown>>) {
      rows.push({
        api_key: String(r.api_key ?? ""),
        priority: 0,
        last_used_at: (r.last_used_at as string | null) ?? null,
      });
    }

    rows.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      const ta = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
      const tb = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
      return ta - tb;
    });

    const picked = rows.find((r) => r.api_key.length > 0);
    if (picked) {
      cached = { key: picked.api_key, at: Date.now() };
      return picked.api_key;
    }
  }

  const fallback = envKey();
  if (fallback) cached = { key: fallback, at: Date.now() };
  return fallback;
}

/** Drop the cached key (call after an auth failure so the next call re-reads). */
export function clearAbliterationKeyCache(): void {
  cached = null;
}
