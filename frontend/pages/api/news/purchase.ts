// pages/api/news/purchase.ts
import { Connection, clusterApiUrl } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createClient(req, res);

  const user = authVerifier({ req, res });

  const { walletAddress, newsId, txSignature } = req.body;
  if (!walletAddress || !newsId || !txSignature) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // Optionally verify the transaction on-chain
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const tx = await connection.getTransaction(txSignature, {
      maxSupportedTransactionVersion: 0,
    });
    if (!tx) {
      return res.status(400).json({ error: "Transaction not found on-chain" });
    }
    // Further verification (e.g. checking that the treasury account received the right amount)
    // could be added here.
  } catch (error) {
    return res.status(500).json({ error: "Error verifying transaction", details: (error as Error)?.message || error });
  }

  // Record the purchase in Supabase.
  // Assumes a Supabase table "news_purchases" with columns: wallet_address, news_id, tx_signature.
  const { error } = await supabase
    .from("news_purchases")
    .insert([{ wallet_address: walletAddress, news_id: newsId, tx_signature: txSignature, user_id: user!.user_id }]);

  if (error) {
    return res.status(500).json({ error: "Error recording purchase" });
  }

  return res.status(200).json({ success: true, message: "News purchase recorded" });
}
