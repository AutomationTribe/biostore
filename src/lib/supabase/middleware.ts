import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * Middleware to refresh session and manage auth cookies
 * Called on every request to keep session fresh
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieOptions[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getSession();

  return response;
}
