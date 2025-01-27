import { BiCommentDetail, BiUpvote } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { CardRank, NewsCardProps } from "config/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "./Tooltip";

dayjs.extend(relativeTime);

export default function NewsCard({ newsData: { publishedAt, rank, src, title, locked } }: NewsCardProps) {
  const getRankColor = (rank: CardRank) => {
    const rankColors: Record<CardRank, string> = {
      [CardRank.Basic]: "bg-green-800",
      [CardRank.Intermediate]: "bg-yellow-700",
      [CardRank.Advanced]: "bg-blue-800",
      [CardRank.Elite]: "bg-purple-800",
      [CardRank.Legendary]: "bg-red-800",
    };
    return rankColors[rank] || "bg-gray-800";
  };

  const isHot = dayjs().diff(publishedAt, "minute") < 30;

  return (
    <div className="rounded-md bg-slate-800 p-3 flex flex-col">
      <div className="flex justify-between items-center">
        <div className={`rounded-md w-fit px-2 ${getRankColor(rank)}`}>{rank}</div>
        <div className="flex items-center">
          {isHot ? (
            <Tooltip text="Hot News!">
              <BsFire className="text-red-400" size={20} />
            </Tooltip>
          ) : (
            <div />
          )}
          {locked ? (
            <Tooltip text="Locked">
              <IoMdLock className="text-gray-200" size={22} />
            </Tooltip>
          ) : (
            <div />
          )}
        </div>
      </div>
      <h1 className={`font-bold my-3 flex-grow ${locked && "blur-md"}`}>{title}</h1>

      <div className="relative w-full h-48 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity">
        {locked && (
          <div className="shiny font-semibold justify-center items-center flex flex-col bg-black/30 absolute w-full h-full transition-opacity z-10">
            <div className="flex items-center">
              <img className="h-6 w-6 mr-2" src="/images/flux-small.png" />
              <span>34.99</span>
            </div>
            BUY NOW
          </div>
        )}

        <img src={src} alt={title} className={`absolute inset-0 w-full h-full object-cover ${locked && "blur-md"}`} />
      </div>
      <div className="flex mt-3 justify-between items-center">
        <div className="flex">
          <Tooltip text="Upvote">
            <div className="mr-2 bg-white/10 rounded-md px-2 py-1 flex items-center cursor-pointer hover:bg-green-500/50 text-slate-300 hover:text-green-200 transition-colors">
              <BiUpvote size={20} />
            </div>
          </Tooltip>
          <Tooltip text="Comments">
            <div className="mr-2 bg-white/10 rounded-md px-2 py-1 flex items-center cursor-pointer hover:bg-blue-800 hover:text-blue-200 text-slate-300 transition-colors">
              <BiCommentDetail size={20} />
            </div>
          </Tooltip>
        </div>
        <div className="text-gray-300">{dayjs(publishedAt).fromNow()}</div>
      </div>
    </div>
  );
}
