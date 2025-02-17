import { decodeTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
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

    // Fetch news data early to get price information
    const { data: newsData, error: newsError } = await supabase.from("news").select("*").eq("id", newsId).single();

    if (newsError || !newsData) {
      return NextResponse.json({ success: false, error: "News not found" }, { status: 404 });
    }

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const tx = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        throw new Error("Transaction not found on-chain");
      }

      // Verify buyer identity (wallet is transaction signer)
      const message = tx.transaction.message;
      const accountKeys = message.getAccountKeys();
      const signers = accountKeys.staticAccountKeys.slice(0, message.header.numRequiredSignatures);
      const walletPubkey = new PublicKey(walletAddress);
      const isSigner = signers.some((signer) => signer.equals(walletPubkey));
      if (!isSigner) {
        throw new Error("Wallet address is not a transaction signer");
      }

      const instructions = message.compiledInstructions;

      if (isUserToAppPurchase) {
        // Validate token transfer to treasury
        const tokenProgramId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        let validTransfer = false;
        let transferredAmount = BigInt(0);

        // Validate amount matches news price
        const mintInfo = await connection.getTokenSupply(fluxMint);
        if (!mintInfo.value) {
          throw new Error("Failed to fetch token mint info");
        }

        for (const instruction of instructions) {
          const instrProgramId = accountKeys.get(instruction.programIdIndex);

          if (!instrProgramId?.equals(tokenProgramId)) continue;

          const transferInstruction = decodeTransferCheckedInstruction(
            {
              programId: instrProgramId,
              keys: instruction.accountKeyIndexes.map((index) => ({
                pubkey: accountKeys.get(index)!,
                isSigner: false,
                isWritable: false,
              })),
              data: Buffer.from(instruction.data),
            },
            tokenProgramId,
          );
          // Verify destination account
          const destination = transferInstruction.keys.destination.pubkey;

          if (!destination.equals(treasuryTokenAccount)) continue;
          // Get transferred amount and mint
          transferredAmount = transferInstruction.data.amount;

          const mint = transferInstruction.keys.mint.pubkey;

          // Verify correct mint is being used
          if (!mint.equals(fluxMint)) {
            throw new Error("Incorrect token mint used in transfer");
          }

          const decimals = mintInfo.value.decimals;
          const expectedAmount = BigInt(newsData.price) * 10n ** BigInt(decimals);

          if (transferredAmount !== expectedAmount) {
            throw new Error(`Incorrect amount: ${transferredAmount} transferred, expected ${expectedAmount}`);
          }

          validTransfer = true;
          break;
        }

        if (!validTransfer) {
          throw new Error("Valid transfer to treasury not found");
        }
      } else {
        // Validate program ID
        const isValidProgramId = instructions.some((instruction) => {
          const programId = accountKeys.get(instruction.programIdIndex);
          return programId?.equals(expectedProgramId);
        });

        if (!isValidProgramId) {
          throw new Error("Transaction does not contain valid program ID");
        }
      }
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Transaction verification failed",
        },
        { status: 400 },
      );
    }

    // Record the purchase
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
