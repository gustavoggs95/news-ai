import { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { toast } from "react-toastify";
import { createTransferCheckedInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AxiosError } from "axios";
import fluxApi from "config/axios";
import { CardRank, NewsCardProps } from "config/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNewsStore } from "store/newsStore";
import RankTag from "./RankTag";
import Tooltip from "./Tooltip";

dayjs.extend(relativeTime);

export default function NewsCard({ newsData, updateNews }: NewsCardProps) {
  const { created_at, locked, rank, title, thumbnail_url, icon_url, is_purchased, price } = newsData;
  const { openNewsModal } = useNewsStore();

  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const isHot = dayjs().diff(created_at, "hour") < 24;
  const fluxMintAddress = process.env.NEXT_PUBLIC_FLUX_MINT_ADDRESS!;
  const treasuryWalletAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET!;
  const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
  console.log("solanaRpcUrl", solanaRpcUrl);
  const handleUpvoteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handlePurchase = async () => {
    if (!publicKey) {
      // setError("Please connect your wallet.");
      return;
    }
    setLoading(true);
    // setError(null);

    try {
      // Create a connection to Devnet.
      const connection = new Connection(solanaRpcUrl, "confirmed");
      const fluxMint = new PublicKey(fluxMintAddress);
      const treasuryWallet = new PublicKey(treasuryWalletAddress);

      // Derive the associated token accounts for the user's wallet and the treasury wallet.
      const userTokenAccount = await getAssociatedTokenAddress(fluxMint, publicKey);
      const treasuryTokenAccount = await getAssociatedTokenAddress(fluxMint, treasuryWallet);

      // For this example, assume Flux Coin has 9 decimals.
      const decimals = 9;
      // Convert the price to the smallest units.
      const price = newsData.price ?? 0;
      const amount = price * Math.pow(10, decimals);

      // Create the token transfer instruction.
      const transferIx = createTransferCheckedInstruction(
        userTokenAccount, // Source token account.
        fluxMint, // The Flux Coin mint.
        treasuryTokenAccount, // Destination token account (your treasury).
        publicKey, // Owner of the source account.
        amount, // Amount to transfer (in smallest units).
        decimals, // Number of decimals.
      );

      // Build the transaction.
      const transaction = new Transaction().add(transferIx);
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = latestBlockhash.blockhash;

      // Send the transaction using the wallet adapter.
      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed",
      );
      setTxSignature(signature);

      // Optionally, call your backend API to record the purchase.
      const response = await fluxApi.post("/api/news/purchase", {
        walletAddress: publicKey.toBase58(),
        newsId: newsData.id,
        txSignature: signature,
      });
      const data = await response.data;
      if (!data.success) {
        toast.error(data.error || "Database error.");
        console.log("ERR data.success", data);
      } else {
        toast.success("News has been purchased!");
        updateNews(newsData);
      }
    } catch (err) {
      console.log("ERR CATCH", err);
      const errorMessage = (err as AxiosError<{ error?: string }>)?.response?.data?.error || (err as Error)?.message;
      toast.error(errorMessage || "Transaction error.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = locked && !is_purchased;

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
        className={`relative w-full h-48 overflow-hidden rounded-md transition-opacity ${!thumbnail_url ? "bg-white/10" : ""}`}
      >
        {/* 🔒 LOCKED */}
        {isLocked && (
          <div className="shiny font-semibold justify-center items-center flex flex-col bg-black/30 absolute w-full h-full transition-opacity z-10">
            <div className="flex items-center">
              <img className="h-6 w-6 mr-2" src="/images/flux-small.png" />
              <span>{price}</span>
            </div>

            {loading ? "Processing..." : "BUY NOW"}

            {txSignature && (
              <p>
                Transaction Signature:{" "}
                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {txSignature}
                </a>
              </p>
            )}
          </div>
        )}

        <img
          src={thumbnail_url || icon_url || undefined}
          alt={title}
          className={`absolute inset-0 ${thumbnail_url ? "w-full h-full" : "w-20 h-20"} object-center m-auto object-cover ${isLocked && "blur-md"}`}
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
