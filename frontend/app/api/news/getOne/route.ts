import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getDecodedToken } from "utils/validators";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");

  if (!idParam) {
    return NextResponse.json({ success: false, error: "ID is required" }, { status: 401 });
  }

  try {
    const id = parseInt(idParam, 10);

    const decodedToken = getDecodedToken({ req });
    const { data, error } = await supabase.rpc("get_single_news_with_join", {
      p_buyer_id: decodedToken?.user_id,
      news_id: id,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, news: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
