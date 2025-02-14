"use client";

import { useEffect, useState } from "react";
import { BiNews } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { MdSearchOff } from "react-icons/md";
import { PurchaseSkeleton } from "components/PurchaseSkeleton";
import fluxApi from "config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

interface MyNews {
  id: string;
  title: string;
  url: string;
  price: number;
  created_at: string;
  views: number;
  purchases: number; // Number of purchases for this post
  thumbnail_url?: string;
}

export default function AppMyNews() {
  const [news, setNews] = useState<MyNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getMyNews = async () => {
      try {
        setLoading(true);
        const response = await fluxApi.get("/api/news/myPosts");
        const data = response.data;
        if (data.success) {
          setNews(data.news);
        }
      } catch (error) {
        console.log("My News list error.", error);
      } finally {
        setLoading(false);
      }
    };
    getMyNews();
  }, []);

  return (
    <div className="text-gray-100">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
          <p className="text-gray-400 mt-2">View your created news posts and details.</p>
        </div>

        {loading ? (
          <PurchaseSkeleton />
        ) : news.length === 0 ? (
          <div className="flex text-center text-gray-500 py-20 justify-center text-xl items-center">
            <MdSearchOff size={30} className="mt-1 mr-3" /> <span>No posts found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-slate-600 table-fixed">
              <thead className="bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="w-[40%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Article
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Views
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Purchases
                  </th>
                  <th
                    scope="col"
                    className="w-[13%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-slate-800">
                {news.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-10 whitespace-nowrap relative overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt="list-thumb"
                        className="absolute left-0 top-0 w-full h-full object-cover z-10 opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center z-20 pl-5 bg-gradient-to-r to-slate-800 from-transparent">
                        <FiFileText className="h-5 w-5 text-gray-200 mr-2" />
                        <span className="font-medium text-gray-100 truncate">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        {post.price && (
                          <img
                            className="object-cover object-center h-5 w-5 shadow-md mr-2"
                            alt="Flux Logo"
                            src="/images/flux-png.png"
                          />
                        )}
                        {post.price}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{post.views}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{post.purchases}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <time dateTime={post.created_at}>{dayjs(post.created_at).fromNow()}</time>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <Link
                        href={`/app?news=${post.id}`}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                      >
                        View Post
                        <BiNews className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
