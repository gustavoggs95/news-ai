import { Connection, clusterApiUrl } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export async function POST(req: Request) {
  try {
    // Create the Supabase client. Adjust createClient if it now only accepts the request.
    const supabase = await createClient();

    // Verify the user based on your auth logic.
    const user = authVerifier({ req });

    // Parse the JSON body from the request.
    const body = await req.json();
    const { walletAddress, newsId, txSignature } = body;

    if (!walletAddress || !newsId || !txSignature) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // Optionally verify the transaction on-chain.
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const tx = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });
      if (!tx) {
        return NextResponse.json({ success: false, error: "Transaction not found on-chain" }, { status: 400 });
      }
      // Further verification can be added here.
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Error verifying transaction",
        },
        { status: 500 },
      );
    }

    // Record the purchase in Supabase.
    const { data: newsData, error: newsError } = await supabase.from("news").select("*").eq("id", newsId).single();

    if (newsError) {
      return NextResponse.json({ success: false, error: "Error selecting news" }, { status: 500 });
    }
    console.log("insert parameters", {
      wallet_address: walletAddress,
      news_id: newsId,
      tx_signature: txSignature,
      buyer_user_id: user!.user_id,
      seller_user_id: newsData.author_id,
    });
    // Insert the purchase record into the "news_purchases" table.
    const { error } = await supabase.from("news_purchases").insert([
      {
        wallet_address: walletAddress,
        news_id: newsId,
        tx_signature: txSignature,
        buyer_user_id: user!.user_id,
        seller_user_id: newsData.author_id,
      },
    ]);

    if (error) {
      console.log("error", error.message);
      return NextResponse.json({ success: false, error: error.message || "Error recording purchase" }, { status: 500 });
    }

    return NextResponse.json({ success: true, news: newsData, message: "News purchase recorded" }, { status: 200 });
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
