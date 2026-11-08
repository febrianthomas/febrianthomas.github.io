import assert from "node:assert/strict";
import { test } from "node:test";
import { getSupabase } from "../src/lib/supabase.ts";

test("Supabase requires both public environment variables", () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  assert.throws(getSupabase, /Set NEXT_PUBLIC_SUPABASE_URL/);

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  assert.throws(getSupabase, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
});

test("Supabase reuses the configured client without a network request", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_example";

  const client = getSupabase();
  assert.ok(client.auth);
  assert.equal(getSupabase(), client);
});
