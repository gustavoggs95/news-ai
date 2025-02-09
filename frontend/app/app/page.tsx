"use client";

import { useEffect, useState } from "react";
import NewsCard from "components/NewsCard";
import SkeletonCard from "components/SkeletonCard";
import fluxApi from "config/axios";
import { GetNewsData, GetNewsResponse } from "types/api";

// Import the SkeletonCard component

export default function AppMain() {
  const [news, setNews] = useState<GetNewsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fluxApi.get("/api/news");
        const data = res.data as GetNewsResponse;
        if (data.success) {
          setNews(data?.news);
        } else {
          console.log("Error fetching news:", data?.error);
        }
      } catch (error) {
        console.log("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const updateNews = (updatedNews: GetNewsData) => {
    setNews((prevNews) =>
      prevNews.map((newsItem) => (newsItem.id === updatedNews.id ? { ...newsItem, is_purchased: true } : newsItem)),
    );
  };

  return (
    <div className="flex-grow p-4 mt-[70px]">
      <div className="text-white body-font mt-10 max-w-2xl sm:max-w-2xl lg:max-w-3xl xl:max-w-6xl xxl:max-w-8xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
            : news.map((newsData, index) => <NewsCard key={index} newsData={newsData} updateNews={updateNews} />)}
        </div>
      </div>
    </div>
  );
}
