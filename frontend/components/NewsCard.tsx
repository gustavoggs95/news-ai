import { BiCommentDetail } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { IoMdLock } from "react-icons/io";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { CardRank, NewsCardProps } from "config/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNewsStore } from "store/newsStore";
import RankTag from "./RankTag";
import Tooltip from "./Tooltip";

dayjs.extend(relativeTime);

export default function NewsCard({ newsData }: NewsCardProps) {
  const { created_at, locked, rank, title, thumbnail_url, icon_url } = newsData;
  const { openNewsModal } = useNewsStore();

  const isHot = dayjs().diff(created_at, "hour") < 24;

  const handleUpvoteClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="rounded-md bg-slate-800 p-3 flex flex-col cursor-pointer hover:bg-slate-750 transition-colors"
      onClick={() => openNewsModal(newsData)}
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
          {locked ? (
            <Tooltip text="Locked">
              <IoMdLock className="text-gray-200" size={22} />
            </Tooltip>
          ) : (
            <div />
          )}
        </div>
      </div>
      <h1 className={`font-bold my-3 flex-grow line-clamp-3 ${locked && "blur-md"}`}>{title}</h1>
      <div
        className={`relative w-full h-48 overflow-hidden rounded-md transition-opacity ${!thumbnail_url ? "bg-white/10" : ""}`}
      >
        {/* 🔒 LOCKED */}
        {locked && (
          <div className="shiny font-semibold justify-center items-center flex flex-col bg-black/30 absolute w-full h-full transition-opacity z-10">
            <div className="flex items-center">
              <img className="h-6 w-6 mr-2" src="/images/flux-small.png" />
              <span>34.99</span>
            </div>
            BUY NOW
          </div>
        )}

        <img
          src={thumbnail_url || icon_url || undefined}
          alt={title}
          className={`absolute inset-0 ${thumbnail_url ? "w-full h-full" : "w-20 h-20"} object-center m-auto object-cover ${locked && "blur-md"}`}
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
