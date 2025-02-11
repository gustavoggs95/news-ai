"use client";

import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsCard from "components/NewsCard";
import SkeletonCard from "components/SkeletonCard";
import fluxApi from "config/axios";
import { GetNewsData, GetNewsResponse } from "types/api";

export default function AppMain() {
  const initialLimit = 12;
  const [news, setNews] = useState<GetNewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(initialLimit); // default value
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic limit based on viewport height
  useEffect(() => {
    const estimatedCardHeight = 376;
    const rowsThatFit = Math.floor(window.innerHeight / estimatedCardHeight);
    const columns = 4;
    const itemsThatFit = rowsThatFit * columns;
    setLimit(itemsThatFit);
    setOffset(initialLimit);
  }, []);

  // Fetch news items based on the current offset and limit
  const fetchNews = async () => {
    try {
      const res = await fluxApi.get(`/api/news?limit=${limit}&offset=${offset}`);
      const data = res.data as GetNewsResponse;
      if (data.success) {
        if (data.news.length < limit) {
          setHasMore(false);
        }
        setNews((prevNews) => [...prevNews, ...data.news]);
      } else {
        console.error("Error fetching news:", data.error);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or when limit changes
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, limit]);

  // Function to fetch more data when user scrolls
  const fetchMoreData = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const updateNews = (updatedNews: GetNewsData) => {
    setNews((prevNews) =>
      prevNews.map((newsItem) => (newsItem.id === updatedNews.id ? { ...newsItem, is_purchased: true } : newsItem)),
    );
  };

  if (loading && news.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={news.length} // current number of loaded items
      next={fetchMoreData} // function to load more items
      hasMore={hasMore} // indicates if there are more items to load
      loader={
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-infinite-${index}`} />
          ))}
        </div>
      } // loader component while fetching more items
      endMessage={
        <p className="text-center py-10 text-gray-300">
          <b>No more news</b>
        </p>
      }
    >
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6">
        {news.map((newsData, index) => (
          <NewsCard key={`${newsData.id}-${index}`} newsData={newsData} updateNews={updateNews} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
