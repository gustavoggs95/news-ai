"use client";

import { useEffect, useState } from "react";
import { BiWallet } from "react-icons/bi";
import { BiNews } from "react-icons/bi";
import { FiCopy, FiFileText } from "react-icons/fi";
import { MdSearchOff } from "react-icons/md";
import { PurchaseSkeleton } from "components/PurchaseSkeleton";
import fluxApi from "config/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

interface Purchase {
  id: string;
  seller_user_id: number;
  news_id: number;
  purchased_at: string;
  wallet_address: string;
  tx_signature: string;
  buyer_user_id: number;
  seller: { username: string; public_address: string };
  news: { title: string; url: string; price: number; thumbnail_url: string };
}

const minify = (str: string, sliceLength = 4) => {
  if (!str) return "";
  return str.length > sliceLength * 2 ? str.slice(0, sliceLength) + "..." + str.slice(-sliceLength) : str;
};

export default function AppPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPurchases = async () => {
      try {
        setLoading(true);
        const response = await fluxApi.get("/api/news/purchase/list");
        const data = response.data;
        if (data.success) {
          setPurchases(data.news_purchases);
        }
        console.log("purchase data", data);
      } catch (error) {
        console.log("Purchases list error.", error);
      } finally {
        setLoading(false);
      }
    };
    getPurchases();
  }, []);

  return (
    <div className="text-gray-100">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
          <p className="text-gray-400 mt-2">View your news article purchase history and transaction details.</p>
        </div>

        {loading ? (
          <PurchaseSkeleton />
        ) : purchases.length === 0 ? (
          <div className="flex text-center text-gray-500 py-20 justify-center text-xl items-center">
            <MdSearchOff size={30} className="mt-1 mr-3" /> <span>No purchases found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-slate-600 table-fixed">
              <thead className="bg-slate-800">
                <tr>
                  <th
                    scope="col"
                    className="w-1/3 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Article
                  </th>
                  <th
                    scope="col"
                    className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Seller
                  </th>
                  <th
                    scope="col"
                    className="w-[13%] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Price
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
                    Transaction
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-slate-800">
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-4 py-10 whitespace-nowrap relative overflow-hidden">
                      <div className="flex items-center opacity-0">
                        <FiFileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-100 max-w-sm truncate">{purchase.news.title}</span>
                      </div>
                      <img
                        src={purchase.news.thumbnail_url}
                        alt="list-thumb"
                        className="absolute left-0 top-0 w-full h-full object-cover z-10 opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center z-20 pl-5 bg-gradient-to-r to-slate-800 from-transparent ">
                        <FiFileText className="h-5 w-5 text-gray-200 mr-2" />
                        <span className="font-medium text-gray-100 max-w-sm truncate">{purchase.news.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <span className="max-w-sm truncate">
                        {purchase.seller.username || purchase.seller.public_address}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex">
                        <img
                          className="object-cover object-center h-5 w-5 shadow-md mr-2"
                          alt="Flux Logo"
                          src="/images/flux-png.png"
                        />
                        {purchase.news.price}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <time dateTime={purchase.purchased_at}>{dayjs(purchase.purchased_at).fromNow()}</time>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <BiWallet className="h-4 w-4 text-gray-400" />
                          <span>{minify(purchase.wallet_address)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            <span className="font-semibold">TX:</span> {minify(purchase.tx_signature)}
                          </span>
                          <button
                            onClick={() => navigator.clipboard.writeText(purchase.tx_signature)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <FiCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                      <Link
                        href={`/app?news=${purchase.news_id}`}
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
