import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export async function GET(req: Request) {
  try {
    const decodedToken = authVerifier({ req });
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select(
        `
        *,
        author:users(username, public_address),
        purchases:news_purchases!news_id(count)
      `,
      )
      .eq("author_id", decodedToken.user_id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const newsWithPurchases = (data || []).map((item) => ({
      ...item,
      purchases: Array.isArray(item.purchases) && item.purchases.length > 0 ? item.purchases[0].count : 0,
    }));

    return NextResponse.json({ success: true, news: newsWithPurchases }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
