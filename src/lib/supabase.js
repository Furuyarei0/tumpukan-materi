import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseClient() {
  if (client) return client;

  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;
  if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
    throw new Error("Konfigurasi Supabase belum tersedia. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }

  client = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}