import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Mark the function as async since cookies() now returns a Promise.
export async function createClient() {
  // Wait for the cookies store to resolve.
  const cookieStore = await cookies();

  // Create an interface that mimics what your previous createClient expected.
  const cookieInterface = {
    async getAll() {
      // cookieStore.getAll() returns an array. We add an explicit type annotation
      // for each cookie item.
      return cookieStore.getAll().map((cookie: { name: string; value: string }) => ({
        name: cookie.name,
        value: cookie.value || "",
      }));
    },
    setAll() {
      // setAll(cookiesToSet: { name: string; value: string }[]) {
      // In the new App Router, setting cookies is typically done via NextResponse.
      // For now, this function is not implemented.
      console.warn("setAll is not implemented in this context");
    },
  };

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: cookieInterface,
  });
}
