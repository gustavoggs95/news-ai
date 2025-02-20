"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@headlessui/react";
import fluxApi from "config/axios";
import { useNewsStore } from "store/newsStore";
import { useUserStore } from "store/userStores";
import { twMerge } from "tailwind-merge";
import { AddCommentInput } from "types/api";
import { CommentsType } from "types/supabase";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import Loader from "./Loader";

interface CommentData {
  text: string;
}

export interface CommentList extends CommentsType {
  username: string;
  public_address: string;
  likes_count: number;
  is_liked: boolean;
  child_comments?: CommentList[];
}

export default function CommentsSection() {
  const [commentData, setCommentData] = useState<CommentData>({ text: "" });
  const [commentList, setCommentList] = useState<CommentList[]>([]);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const { news } = useNewsStore();
  const { user } = useUserStore();

  const sendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentData.text || !news || !user) {
      return;
    }
    const sendCommentParameters: AddCommentInput = { content: commentData.text, news_id: news?.id, user_id: user.id };
    try {
      setLoadingSend(true);
      const result = await fluxApi.post("/api/comments/add", sendCommentParameters);

      const data = result.data;
      if (data.success) {
        setCommentData({ text: "" });
        const newComment: CommentList = {
          ...data.comment,
          username: user.username,
          public_address: user.public_address,
          likes_count: 0,
          is_liked: false,
          child_comments: [],
        };

        setCommentList((prevList) => [newComment, ...prevList]);
      }
    } catch (error) {
      console.error("Error sending comment:", (error as Error)?.message);
    } finally {
      setLoadingSend(false);
    }
  };

  const getCommentList = async () => {
    if (!news || !user) {
      return;
    }
    setLoadingList(true);
    try {
      const result = await fluxApi.get(`/api/comments/list?news_id=${news.id}`);
      console.log("result data", result.data);
      setCommentList(result?.data?.comments || []);
    } catch (error) {
      console.log("error", (error as Error)?.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!news || !user) {
      return;
    }
    const replyParameters: AddCommentInput = { content, news_id: news.id, user_id: user.id, parent_id: parentId };
    try {
      const result = await fluxApi.post("/api/comments/add", replyParameters);

      if (result.data.success) {
        const newReply: CommentList = {
          ...result.data.comment,
          username: user.username,
          public_address: user.public_address,
          likes_count: 0,
          is_liked: false,
          child_comments: [],
        };

        setCommentList((prevList) => {
          const updateComments = (comments: CommentList[]): CommentList[] => {
            return comments.map((comment) => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  child_comments: [...(comment.child_comments || []), newReply],
                };
              } else if (comment.child_comments && comment.child_comments.length > 0) {
                return {
                  ...comment,
                  child_comments: updateComments(comment.child_comments),
                };
              }
              return comment;
            });
          };

          const updatedList = updateComments(prevList);
          console.log("Updated comment list:", updatedList);
          return updatedList;
        });
      }
    } catch (error) {
      console.log("error", (error as Error)?.message);
    }
  };

  useEffect(() => {
    getCommentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <form
        onSubmit={sendComment}
        className="flex flex-col items-center mb-3 bg-white/5 hover:bg-[rgba(255,255,255,0.06)] transition-colors rounded-lg"
      >
        <Textarea
          disabled={loadingSend}
          value={commentData.text}
          placeholder="Join the discussion!"
          onChange={(e) => setCommentData({ ...commentData, text: e.target.value })}
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
          minLength={3}
          maxLength={255}
          rows={3}
        />
        <div className="border-t border-white/30 w-full justify-end items-center flex py-2 px-2">
          <button
            disabled={loadingSend}
            type="submit"
            className="rounded-lg bg-green-700 hover:bg-green-600 transition-colors px-5 py-1.5 flex"
          >
            {loadingSend && <Loader className="h-5 w-5 fill-white mt-0.5 mr-3" />}
            {loadingSend ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
      <div className="space-y-3">
        {loadingList ? (
          <CommentSkeleton />
        ) : commentList.length > 0 ? (
          commentList?.map((comment, index) => (
            <Comment key={comment.id || index} comment={comment} onReply={handleReply} />
          ))
        ) : (
          <div className="text-gray-300 w-full flex justify-center items-center h-[133px]">
            There's nothing here, be the first to comment.
          </div>
        )}
      </div>
    </div>
  );
}
