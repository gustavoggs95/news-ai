"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { NewsType } from "types/supabase";
import Loader from "./Loader";

export default function CreateNews({ onClose }: { onClose: () => void }) {
  const [newsData, setNewsData] = useState<Partial<NewsType>>({});
  const [loading, setLoading] = useState(false);

  const createNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/news", newsData);
      toast.success("Post Created Successfully!");
      onClose();
      console.log("News Created:", res.data);
    } catch (error) {
      toast.error("Error Creating News");
      console.log("Error Creating news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 mx-auto">
      <form onSubmit={createNews}>
        <div className="space-y-4 mb-10">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="title" className="font-medium text-gray-300">
              Title <span className="font-thin text-gray-400">(Optional)</span>
            </label>
            <input
              id="news-title"
              value={newsData.title || ""}
              onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
              className="rounded-md cursor-text  border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-white bg-flux-input-500 hover:bg-flux-input-400 hover:bg-flux-input/1 placeholder:text-white/50 caret-white transition-colors"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label htmlFor="url" className="font-medium text-gray-300">
              URL *
            </label>
            <input
              id="news-url"
              value={newsData.url || ""}
              onChange={(e) => setNewsData({ ...newsData, url: e.target.value })}
              placeholder="https://example.com"
              type="url"
              required
              className="rounded-md cursor-text  border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-white bg-flux-input-500 hover:bg-flux-input-400 hover:bg-flux-input/1 placeholder:text-white/50 caret-white transition-colors"
            />
          </div>
        </div>
        <div>
          <button type="submit" className="relative inline-flex items-center cursor-pointer w-full" disabled={loading}>
            <a className="justify-center w-full inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 px-14 py-3 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline">
              <div className="flex text-lg">
                <span className="justify-center">{loading ? "Creating News..." : "Create News"}</span>
                {loading && <Loader className="w-7 h-7 fill-white absolute right-4" />}
              </div>
            </a>
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
          </button>
        </div>
      </form>
    </div>
  );
}
