import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const user = authVerifier({ req });

    const expectedProgramId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
    const fluxMint = new PublicKey(process.env.NEXT_PUBLIC_FLUX_MINT_ADDRESS!);
    const treasuryPublicAddress = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET!);
    const treasuryTokenAccount = await getAssociatedTokenAddress(fluxMint, treasuryPublicAddress);

    const body = await req.json();
    const { walletAddress, newsId, txSignature, isUserToAppPurchase } = body;

    if (!walletAddress || !newsId || !txSignature) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const tx = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        throw new Error("Transaction not found on-chain");
      }

      const message = tx.transaction.message;
      const accountKeys = message.getAccountKeys();
      const instructions = message.compiledInstructions;

      if (isUserToAppPurchase) {
        // Look for a token transfer instruction that sends tokens to the treasury.
        const tokenProgramId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        const validTransfer = instructions.some((instruction) => {
          // Ensure the instruction is from the token program.
          const instrProgramId = accountKeys.get(instruction.programIdIndex);
          if (!instrProgramId || !instrProgramId.equals(tokenProgramId)) return false;

          const destIndex = instruction.accountKeyIndexes[2];
          const destAccount = accountKeys.get(destIndex);

          return destAccount?.equals(treasuryTokenAccount);
        });
        if (!validTransfer) {
          throw new Error("Treasury token account is not valid");
        }
      } else {
        const isValidProgramId = instructions.some((instruction) => {
          const programId = accountKeys.get(instruction.programIdIndex);

          return programId?.equals(expectedProgramId);
        });
        if (!isValidProgramId) {
          throw new Error("Program ID is not valid");
        }
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Error verifying transaction",
        },
        { status: 400 },
      );
    }

    // Record the purchase in Supabase.
    const { data: newsData, error: newsError } = await supabase.from("news").select("*").eq("id", newsId).single();

    if (newsError) {
      return NextResponse.json({ success: false, error: "Error selecting news" }, { status: 500 });
    }

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
