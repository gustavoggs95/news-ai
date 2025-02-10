import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export async function GET(req: Request) {
  try {
    const decodedToken = authVerifier({ req });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news_purchases")
      .select(
        `
    *,
    seller:users!news_purchases_seller_user_id_fkey(username, public_address),
    news:news!news_purchases_news_id_fkey(url, title, price)
  `,
      )
      .eq("buyer_user_id", decodedToken.user_id);

    console.log("pruchase list  DATA", data);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, news_purchases: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
