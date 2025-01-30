import { useEffect, useState } from "react";
import axios from "axios";
import { CardRank, NewsData } from "config/types";
import { NewsType } from "types/supabase";
import AppSideBar from "./AppSideBar";
import NewsCard from "./NewsCard";
import SkeletonCard from "./SkeletonCard";

// Import the SkeletonCard component

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCardsData: NewsData[] = [
  {
    publishedAt: minutesAgo(3),
    rank: CardRank.Legendary,
    src: "https://crypto.news/app/uploads/2024/10/crypro-news-Bitcoin-option61-880x523.webp",
    title: "Bitcoin Hits New All-Time High",
    locked: true,
  },
  {
    publishedAt: minutesAgo(54343),
    rank: CardRank.Basic,
    src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXOR9IdirsvvoFTnSnRcDBXxBHEGdBDJx3aT1wcpiMWFffNWi6b-WgJWG9U58AITLMnc7cQ-sDcNUJovGg0CkGx7Ixu6RUw1y-uvh1gOCNc4-9fjse1GciR_q1LDx3moKG7OtuzbtBubjLpHcC0kI3ETVdWSSCttcOUJZOelhQux8jO7g0mMj_sdOFCpE/s654/Screenshot_1174.png",
    title: "NFT Sales Surge in 2025",
  },
  {
    publishedAt: minutesAgo(3232),
    rank: CardRank.Intermediate,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0I6Rv_79WghPJfgawTM9pycjHV6Fxhxwwgg&s",
    title: "Ethereum 2.0 Launches Successfully",
  },
  {
    publishedAt: minutesAgo(42324),
    rank: CardRank.Advanced,
    src: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/34389bcaab934726b088cfddbf096ea2.jpg",
    title: "Crypto Market Sees Major Correction",
  },
  {
    publishedAt: minutesAgo(0.1),
    rank: CardRank.Elite,
    src: "https://disruptafrica.com/wp-content/uploads/2020/08/Crypto-News.jpg",
    title: "DeFi Platforms Gain Popularity",
  },
];

export default function AppMain() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("/api/news");
        setNews(res.data);
      } catch (error) {
        console.log("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="flex h-[calc(100vh-70px)]">
      <div className="w-64 hidden md:block">
        <AppSideBar />
      </div>
      <div className="flex-grow p-4">
        <div className="text-white body-font mt-10 max-w-8xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
              : news.map((newsData, index) => <NewsCard key={index} newsData={newsData} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
