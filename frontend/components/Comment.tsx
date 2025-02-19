import { useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { LuMessageSquareReply } from "react-icons/lu";
import fluxApi from "config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUserStore } from "store/userStores";
import { CommentList } from "./CommentsSection";

dayjs.extend(relativeTime);

export default function Comment({
  comment: { content, public_address, username, created_at, likes_count, is_liked, id },
}: {
  comment: CommentList;
}) {
  const { user: currentUser } = useUserStore();
  const fullKey = public_address;
  const minifiedKey = fullKey ? `${fullKey.slice(0, 4)}...${fullKey.slice(-4)}` : null;
  const walletUserLabel = username || minifiedKey;
  const [isLiked, setIsLiked] = useState(is_liked || false);
  const [likeCount, setLikeCount] = useState(likes_count || 0);

  const handleLike = async () => {
    // if (!currentUser || isLoading) return;
    if (!currentUser) return;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // setIsLoading(true);
    try {
      const response = await fluxApi.post("/api/comments/like", {
        comments_id: id,
      });
      const data = response.data;

      if (!data.success) {
        console.log("Error liking the comment");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      // setIsLoading(false);
    }
  };
  return (
    <div className="rounded-lg border border-slate-700 p-3">
      <div className="flex items-center">
        <img
          alt="robohash-comment"
          className="h-16 w-16 rounded-full border-[0.5px] border-white/20 self-start bg-black/20"
          src={`https://robohash.org/${fullKey}`}
        />
        <div className="flex flex-col ml-3 space-y-5">
          <div className="flex space-x-2 leading-none">
            <span className="font-semibold">{walletUserLabel}</span>
            <span className="text-gray-400 text-sm -mt-[0.5px]">{dayjs(created_at).fromNow()}</span>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap break-all">{content}</div>
          <div className="text-gray-200 flex space-x-5 font-semibold">
            <button
              onClick={handleLike}
              className={`flex items-center cursor-pointer transition-colors 
                ${currentUser ? "hover:text-gray-100" : "cursor-not-allowed opacity-50"}
                ${isLiked ? "text-blue-500 hover:text-blue-400" : ""}`}
            >
              {isLiked ? <BiSolidLike size={20} className="mr-1" /> : <BiLike size={20} className="mr-1" />} {likeCount}
            </button>
            <div className="flex items-center cursor-pointer hover:text-gray-100 transition-colors">
              <LuMessageSquareReply size={20} className="mr-1 mt-0.5 " />
              Reply
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
