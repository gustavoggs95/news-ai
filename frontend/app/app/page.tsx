"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NewsCard from "components/NewsCard";
import SkeletonCard from "components/SkeletonCard";
import fluxApi from "config/axios";
import { GetNewsData, GetNewsResponse } from "types/api";

export default function AppMain() {
  const [news, setNews] = useState<GetNewsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 16; // adjust as needed

  // Function to fetch news based on current page (using offset and limit)
  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const res = await fluxApi.get(`/api/news?offset=${offset}&limit=${limit}`);
      const data = res.data as GetNewsResponse;
      if (data.success) {
        // If fewer items than expected are returned, no more pages are available
        if (data.news.length < limit) {
          setHasMore(false);
        }
        // Append the new items to the existing news
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

  // Fetch initial and subsequent pages when page state changes
  useEffect(() => {
    fetchNews(page);
  }, [page]);

  // Create an Intersection Observer for the last news item
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNewsElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return; // do not attach observer while loading
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const updateNews = (updatedNews: GetNewsData) => {
    setNews((prevNews) =>
      prevNews.map((newsItem) => (newsItem.id === updatedNews.id ? { ...newsItem, is_purchased: true } : newsItem)),
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6">
      {news.map((newsData, index) => {
        // Wrap the last item with the observer ref to trigger fetching more news
        if (index === news.length - 1) {
          return (
            <div ref={lastNewsElementRef} key={newsData.id}>
              <NewsCard newsData={newsData} updateNews={updateNews} />
            </div>
          );
        } else {
          return <NewsCard key={newsData.id} newsData={newsData} updateNews={updateNews} />;
        }
      })}
      {loading && Array.from({ length: 16 }).map((_, index) => <SkeletonCard key={index} />)}
    </div>
  );
}
