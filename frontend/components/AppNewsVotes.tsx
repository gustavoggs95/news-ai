"use client";

import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { toast } from "react-toastify";
import fluxApi from "config/axios";
import { NewsVoteProps } from "config/types";
import { VoteInput } from "pages/api/upvote/route";
import { useNewsStore } from "store/newsStore";
import { getErrorMessage } from "utils/validators";
import Tooltip from "./Tooltip";

export default function AppNewsVotes({ newsData, updateNews, isModal }: NewsVoteProps) {
  const { news } = useNewsStore();

  const modalNewsData = isModal ? news! : newsData;
  const { updateCurrentNews } = useNewsStore();
  const { vote_type, upvote_count } = modalNewsData;

  const handleUpvoteClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voteType: "upvote" | "downvote",
  ) => {
    e.stopPropagation();

    const voteParameters: VoteInput = {
      news_id: newsData.id,
      vote_type: voteType,
    };
    try {
      const newVoteValue = newsData.vote_type === voteType ? null : voteType;
      const newUpvoteCount = newsData.vote_type === "upvote" ? newsData.upvote_count - 1 : newsData.upvote_count + 1;
      if (isModal) {
        updateCurrentNews({ vote_type: newVoteValue as string, upvote_count: newUpvoteCount });
      } else {
        updateNews!(newsData, { vote_type: newVoteValue as string, upvote_count: newUpvoteCount });
      }

      const response = await fluxApi.post("/api/upvote", voteParameters);
      const data = response.data;
      console.log("Upvote response:", data);
    } catch (error) {
      console.log("Upvote error.", error);
      toast.error(`Vote failed. ${getErrorMessage(error)}`);
    }
  };
  return (
    <div className="mr-2 bg-white/10 rounded-md flex">
      <Tooltip text="Upvote">
        <button
          onClick={(e) => handleUpvoteClick(e, "upvote")}
          className={`${vote_type === "upvote" && "bg-green-500/50"} hover:bg-green-500/70 active:bg-green-500/50  rounded-l-md px-2 py-1 flex items-center cursor-pointer  text-slate-300 hover:text-green-200 transition-colors`}
        >
          <TbArrowBigUp size={20} />
          {Boolean(upvote_count) && <span className="ml-1 font-semibold text-xs">{upvote_count}</span>}
        </button>
      </Tooltip>
      <div className="h-full w-[1px] bg-white/10" />
      <Tooltip text="Downvote">
        <button
          onClick={(e) => handleUpvoteClick(e, "downvote")}
          className={`${vote_type === "downvote" && "bg-red-500/50"} hover:bg-red-500/70 active:bg-red-500/50 rounded-r-md px-2 py-1 flex items-center cursor-pointer  text-slate-300 hover:text-green-200 transition-colors`}
        >
          <TbArrowBigDown size={20} />
        </button>
      </Tooltip>
    </div>
  );
}
