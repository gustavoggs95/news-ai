"use client";

import { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { toast } from "react-toastify";
import { BN, Idl, utils } from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import fluxApi from "config/axios";
import { CardRank, NewsCardProps } from "config/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNewsStore } from "store/newsStore";
import idl from "../components/idl.json";
import Loader from "./Loader";
import RankTag from "./RankTag";
import Tooltip from "./Tooltip";

dayjs.extend(relativeTime);

export default function NewsCard({ newsData, updateNews }: NewsCardProps) {
  const {
    locked,
    is_purchased,
    price,
    created_at,
    rank,
    thumbnail_url,
    title,
    icon_url,
    author_wallet_address,
    is_own,
  } = newsData;
  const { publicKey, signAllTransactions, signTransaction } = useWallet();
  const { openNewsModal } = useNewsStore();
  const [solanaLoading, setSolanaLoading] = useState(false);
  const [fluxLoading, setFluxLoading] = useState(false);
  const isHot = dayjs().diff(created_at, "hour") < 24;
  const isLocked = locked && !is_purchased && !is_own;

  const handleUpvoteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const fluxMintAddress = process.env.NEXT_PUBLIC_FLUX_MINT_ADDRESS!;
  const treasuryWalletAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET!;
  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
  const envProgramId = process.env.NEXT_PUBLIC_PROGRAM_ID!;
  // Program ID for your custom program that implements purchaseNews.
  const programId = new PublicKey(envProgramId);

  const sellerWallet = author_wallet_address;

  const handlePurchase = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet with signTransaction support.");
      return;
    }
    setSolanaLoading(true);

    try {
      // Create a connection to your Solana cluster.
      const connection = new Connection(solanaRpcUrl, "confirmed");

      // Set up an Anchor provider using the wallet adapter.
      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction, // Use signTransaction here instead of sendTransaction
          signAllTransactions: signAllTransactions ?? (async (txs: Transaction[]) => txs),
        },
        { preflightCommitment: "confirmed" },
      );

      // Initialize the program using its IDL and program ID.
      const parsedIdl = idl as Idl;
      const program = new Program(parsedIdl, programId, provider);

      // Define the token mint and derive associated token accounts.
      const fluxMint = new PublicKey(fluxMintAddress);
      const treasuryWallet = new PublicKey(treasuryWalletAddress);

      // Buyer’s associated token account.
      const buyerTokenAccount = await getAssociatedTokenAddress(fluxMint, publicKey);
      // Treasury’s associated token account.
      const treasuryTokenAccount = await getAssociatedTokenAddress(fluxMint, treasuryWallet);

      // Seller’s public key.
      const seller = new PublicKey(sellerWallet);
      const sellerTokenAccount = await getAssociatedTokenAddress(fluxMint, seller);

      // For example, if your token has 9 decimals:
      const decimals = 9;
      const priceValue = price ?? 0;
      // Convert the price into the smallest unit.
      const amount = priceValue * Math.pow(10, decimals);
      const purchaseAmount = new BN(amount);

      // Call your custom program's purchaseNews instruction.
      // This instruction deducts a 20% fee and transfers 80% to the seller.
      const txSignature = await program.methods
        .purchaseNews(purchaseAmount)
        .accounts({
          buyer: publicKey,
          buyerTokenAccount: buyerTokenAccount,
          treasuryTokenAccount: treasuryTokenAccount,
          sellerTokenAccount: sellerTokenAccount,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();
      setSolanaLoading(false);
      setFluxLoading(true);

      // Optionally, call your backend API to record the purchase.
      const response = await fluxApi.post("/api/news/purchase", {
        walletAddress: publicKey.toBase58(),
        newsId: newsData.id,
        txSignature,
      });
      const data = await response.data;
      if (!data.success) {
        toast.error(data.error || "Database error.");
      } else {
        toast.success("News has been purchased!");
        updateNews(newsData);
        openNewsModal(newsData);
      }
    } catch (err) {
      const errorMessage = (err as Error)?.message || "Transaction error.";
      toast.error(errorMessage);
      console.error("Transaction error: ", err);
    } finally {
      setSolanaLoading(false);
      setFluxLoading(false);
    }
  };

  return (
    <div
      className="rounded-md bg-slate-800 p-3 flex flex-col cursor-pointer hover:bg-slate-750 transition-colors"
      onClick={() => {
        return isLocked ? handlePurchase() : openNewsModal(newsData);
      }}
    >
      <div className="flex justify-between items-center">
        <RankTag rank={rank as CardRank} />
        <div className="flex items-center">
          {isHot ? (
            <Tooltip text="Hot News!">
              <BsFire className="text-red-400" size={20} />
            </Tooltip>
          ) : (
            <div />
          )}
          {isLocked ? (
            <Tooltip text="Locked">
              <IoMdLock className="text-gray-200" size={22} />
            </Tooltip>
          ) : (
            <div />
          )}
        </div>
      </div>
      <h1 className={`font-bold my-3 flex-grow line-clamp-3 ${isLocked && "blur-md"}`}>{title}</h1>
      <div
        className={`relative w-full h-48 overflow-hidden rounded-md transition-opacity ${
          !thumbnail_url ? "bg-white/10" : ""
        }`}
      >
        {/* 🔒 LOCKED */}
        {isLocked && (
          <div className="shiny font-semibold justify-center items-center flex flex-col bg-black/30 absolute w-full h-full transition-opacity z-10">
            <div className="flex items-center">
              <img alt="pric-icon" className="h-6 w-6 mr-2" src="/images/flux-small.png" />
              <span>{price}</span>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              {solanaLoading || fluxLoading ? (
                <>
                  <Loader className="fill-white w-5 h-5" />
                  <span>
                    {solanaLoading
                      ? "Processing Solana transaction..."
                      : fluxLoading
                        ? "Recording purchase with Flux..."
                        : ""}
                  </span>
                </>
              ) : (
                "BUY NOW"
              )}
            </div>
          </div>
        )}

        <img
          src={thumbnail_url || icon_url || undefined}
          alt={title}
          className={`absolute inset-0 ${
            thumbnail_url ? "w-full h-full" : "w-20 h-20"
          } object-center m-auto object-cover ${isLocked && "blur-md"}`}
        />
      </div>
      <div className="flex mt-3 justify-between items-center">
        <div className="flex">
          <div className="mr-2 bg-white/10 rounded-md flex">
            <Tooltip text="Upvote">
              <div
                onClick={handleUpvoteClick}
                className="rounded-l-md px-2 py-1 flex items-center cursor-pointer hover:bg-green-500/50 text-slate-300 hover:text-green-200 transition-colors"
              >
                <TbArrowBigUp size={20} />
              </div>
            </Tooltip>
            <div className="h-full w-[1px] bg-white/10" />
            <Tooltip text="Downvote">
              <div
                onClick={handleUpvoteClick}
                className="rounded-r-md px-2 py-1 flex items-center cursor-pointer hover:bg-red-500/50 text-slate-300 hover:text-green-200 transition-colors"
              >
                <TbArrowBigDown size={20} />
              </div>
            </Tooltip>
          </div>
          <Tooltip text="Comments">
            <div className="mr-2 bg-white/10 rounded-md px-2 pb-[.200rem] pt-[.300rem] flex items-center cursor-pointer hover:bg-blue-800 hover:text-blue-200 text-slate-300 transition-colors">
              <BiCommentDetail size={20} />
            </div>
          </Tooltip>
        </div>
        <div className="text-gray-300">{dayjs(created_at).fromNow()}</div>
      </div>
    </div>
  );
}
