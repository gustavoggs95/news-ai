import { useState } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { LuMessageSquareReply } from "react-icons/lu";
import { Textarea } from "@headlessui/react";
import fluxApi from "config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useUserStore } from "store/userStores";
import { twMerge } from "tailwind-merge";
import { CommentList } from "./CommentsSection";
import Loader from "./Loader";

dayjs.extend(relativeTime);

export default function Comment({
  comment,
  onReply,
  isChild = false,
}: {
  comment: CommentList;
  onReply: (parentId: number, content: string) => Promise<void>;
  isChild?: boolean;
}) {
  const { content, public_address, username, created_at, likes_count, is_liked, id, child_comments } = comment;
  const { user: currentUser } = useUserStore();
  const fullKey = public_address;
  const minifiedKey = fullKey ? `${fullKey.slice(0, 4)}...${fullKey.slice(-4)}` : null;
  const walletUserLabel = username || minifiedKey;
  const [isLiked, setIsLiked] = useState(is_liked || false);
  const [likeCount, setLikeCount] = useState(likes_count || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = async () => {
    if (!currentUser) return;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
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
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !replyContent.trim()) return;
    setLoadingReply(true);
    try {
      await onReply(id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 p-3">
      <div className="flex items-start">
        <img
          alt="robohash-comment"
          className="h-16 w-16 rounded-full border-[0.5px] border-white/20 self-start bg-black/20"
          src={`https://robohash.org/${fullKey}`}
        />
        <div className="flex flex-col ml-3 space-y-5 w-full">
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
            {!isChild && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center cursor-pointer hover:text-gray-100 transition-colors"
              >
                <LuMessageSquareReply size={20} className="mr-1 mt-0.5" />
                Reply
              </button>
            )}
          </div>
          {isReplying && (
            <div className="mt-2">
              <form
                onSubmit={handleReply}
                className="flex flex-col items-center mb-3 bg-white/5 hover:bg-[rgba(255,255,255,0.06)] transition-colors rounded-lg"
              >
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  disabled={loadingReply}
                  className={twMerge(
                    "py-1.5 px-3 block w-full resize-none rounded-lg border-none bg-transparent text-sm/6 text-white",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:transparent",
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      const form = e.currentTarget.closest("form");
                      if (form) {
                        form.requestSubmit();
                      }
                    }
                  }}
                  rows={3}
                />

                <div className="border-t border-white/30 w-full justify-end items-center flex py-2 px-2">
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setIsReplying(false)}
                      type="button"
                      className="rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors px-5 py-1.5 flex"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={loadingReply}
                      onClick={handleReply}
                      type="submit"
                      className="rounded-lg bg-green-700 hover:bg-green-600 transition-colors px-5 py-1.5 flex"
                    >
                      {loadingReply && <Loader className="h-5 w-5 fill-white mt-0.5 mr-3" />}
                      {loadingReply ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {child_comments && child_comments.length > 0 && (
        <div className="ml-16 mt-4 space-y-3">
          {child_comments.map((childComment) => (
            <Comment key={childComment.id} comment={childComment} onReply={onReply} isChild />
          ))}
        </div>
      )}
    </div>
  );
}
