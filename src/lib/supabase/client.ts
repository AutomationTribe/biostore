import { createBrowserClient } from "@supabase/ssr";
import { getEnv } from "../env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Create or return cached Supabase browser client.
 * Use in Client Components and client-side operations.
 */
export function createClientSupabaseClient() {
  if (browserClient) return browserClient;

  const env = getEnv();

  browserClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return browserClient;
}
