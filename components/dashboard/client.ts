import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

// Uses the repo's shared client; stays null (empty dashboard) if env vars are missing.
let client: SupabaseClient | null = null;
try {
  client = getSupabase();
} catch {
  client = null;
}
export const supabase = client;
