import { BiLike } from "react-icons/bi";
import { LuMessageSquareReply } from "react-icons/lu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentList } from "./CommentsSection";

dayjs.extend(relativeTime);

export default function Comment({ comment: { content, users, created_at } }: { comment: CommentList }) {
  const fullKey = users?.public_address;
  const minifiedKey = fullKey ? `${fullKey.slice(0, 4)}...${fullKey.slice(-4)}` : null;
  const walletUserLabel = users?.username || minifiedKey;
  return (
    <div className="rounded-lg border border-slate-700 p-3">
      <div className="flex items-center">
        <img
          className="h-16 w-16 rounded-full border-[0.5px] border-white/20 self-start bg-black/20"
          src={`https://robohash.org/${fullKey}`}
        />
        <div className="flex flex-col ml-3 space-y-5">
          <div className="flex space-x-2 leading-none">
            <span className="font-semibold">{walletUserLabel}</span>
            <span className="text-gray-400 text-sm -mt-[0.5px]">{dayjs(created_at).fromNow()}</span>
          </div>
          <div className="text-gray-300">{content}</div>
          <div className="text-gray-200 flex space-x-5 font-semibold">
            <div className="flex items-center cursor-pointer hover:text-gray-100 transition-colors">
              <BiLike size={20} className="mr-1" /> 16
            </div>
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
