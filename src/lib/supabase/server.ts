import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnv } from "../env";

/**
 * Create a Supabase client for use in Server Components and API routes.
 * Handles session refresh automatically.
 */
export async function createServerSupabaseClient() {
  const env = getEnv();
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create an admin Supabase client using service role key.
 * Use only for privileged operations (migrations, backups, admin tasks).
 */
export function createAdminSupabaseClient() {
  const env = getEnv();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // Admin client doesn't use cookies
        },
      },
    }
  );
}

// Aliases for existing code compatibility
export { createServerSupabaseClient as createServerClient };
export { createAdminSupabaseClient as createAdminClient };
