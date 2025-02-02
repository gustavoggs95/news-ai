import { createServerClient } from "@supabase/ssr";
import { NextApiRequest, NextApiResponse } from "next";

export function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      async getAll() {
        return Object.entries(req.cookies).map(([name, value]) => ({ name, value: value || "" }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) => {
            res.setHeader("Set-Cookie", `${name}=${value}; Path=/; HttpOnly`);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
