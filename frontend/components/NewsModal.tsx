"use client";

import { useEffect } from "react";
import { BsFire } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RxExternalLink } from "react-icons/rx";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import ReactModal from "react-modal";
import fluxApi from "config/axios";
import { CardRank } from "config/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNewsStore } from "store/newsStore";
import { OneNewsResponse } from "types/api";
import CommentsSection from "./CommentsSection";
import Loader from "./Loader";
import RankTag from "./RankTag";
import Tooltip from "./Tooltip";

const customStyles: ReactModal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.3s ease-in-out",
    zIndex: 20,
    maxHeight: "calc(100% - 200px)",
    maxWidth: "800px",
    width: "100%",
    borderRadius: "20px",
    backgroundColor: "#1f2937",
    color: "white",
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.3s ease-in-out",
  },
};

dayjs.extend(relativeTime);

export function NewsModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the "news" query parameter
  const routerNews = searchParams.get("news");

  const { news, isNewsModalOpen, isLoading, error, openNewsModal, closeNewsModal, setNews, setLoading, setError } =
    useNewsStore();

  // Handle URL synchronization when the modal opens/closes.
  useEffect(() => {
    if (isNewsModalOpen && news) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("news", news.id.toString());
      router.push(`${pathname}?${newSearchParams.toString()}`);
    } else if (!isNewsModalOpen && searchParams.has("news")) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("news");
      const queryString = newSearchParams.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewsModalOpen, news, pathname, searchParams]);

  // Handle direct URL access with ?news=ID (or ?id=ID on /post/ routes)
  useEffect(() => {
    const handleDirectAccess = async () => {
      const routerId = searchParams.get("id");
      const newsId = routerNews || (pathname.includes("/post/") && routerId);
      if (newsId && !isNewsModalOpen) {
        setLoading(true);
        try {
          const response = await fluxApi.get(`/api/news/getOne?id=${newsId}`);
          const data: OneNewsResponse = response.data;
          console.log("data", data);

          if (!data.success) {
            throw new Error("News not found");
          }

          setNews(data.news);
          openNewsModal(data.news);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load news");
          closeNewsModal();
        } finally {
          setLoading(false);
        }
      }
    };
    handleDirectAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerNews, pathname, searchParams]);

  const handleClose = () => {
    closeNewsModal();
    setNews(null);
  };

  const isHot = news ? dayjs().diff(news.created_at, "hour") < 24 : false;

  return (
    <ReactModal
      isOpen={isNewsModalOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="News Modal"
      ariaHideApp={false}
    >
      <div className="overflow-hidden flex flex-col flex-1">
        <div className="flex-1 overflow-auto">
          <div className="flex justify-between items-center p-4">
            <div />
            <h1 className="max-w-[90%] text-2xl font-bold text-white/90 text-center">
              {news?.title || "News Article"}
            </h1>
            <IoMdClose
              size={26}
              className="cursor-pointer text-white/80 hover:text-white transition-colors self-baseline mt-1.5"
              onClick={handleClose}
            />
          </div>

          <div className="w-full p-4 mx-auto space-y-6">
            {isLoading && <Loader className="mx-auto" />}

            {error && <div className="text-red-400 text-center">{error}</div>}

            {!isLoading && !error && news && (
              <>
                <a
                  href={news.url || undefined}
                  target="_blank"
                  className={`cursor-pointer relative w-full h-48 overflow-hidden flex rounded-lg ${
                    !news.thumbnail_url ? "bg-white/10" : ""
                  }`}
                >
                  <div className="cursor-pointer transition-colors bg-black/20 absolute top-3 right-3 p-2 rounded-lg">
                    <RxExternalLink size={25} />
                  </div>
                  <img
                    src={news.thumbnail_url || news.icon_url || undefined}
                    alt={news.title}
                    className={`m-auto object-cover ${news.thumbnail_url ? "w-full h-full" : "w-20 h-20"}`}
                  />
                  <div className="absolute w-full h-full hover:bg-white/10 transition-colors duration-75" />
                </a>
                <div className="flex items-center justify-between">
                  <RankTag className="py-1" rank={news.rank as CardRank} />
                  <div className="flex items-center space-x-3">
                    {isHot && (
                      <Tooltip text="Hot News!">
                        <BsFire className="text-red-400" size={20} />
                      </Tooltip>
                    )}
                    <a
                      href={news.url || undefined}
                      target="_blank"
                      className="cursor-pointer flex items-center space-x-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-75 px-3 py-1"
                    >
                      <img className="h-5 w-5" src={news.icon_url || undefined} alt="icon-url" />
                      {news.source && <span className="mb-0.5">{news.source}</span>}
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-gray-300">{news.content}</span>
                </div>

                <div className="flex space-x-5 text-gray-400">
                  <div className="flex">
                    <div className="bg-white/10 rounded-md flex h-full">
                      <Tooltip text="Upvote">
                        <div className="rounded-l-md px-2 py-1 flex items-center cursor-pointer hover:bg-green-500/50 text-slate-300 hover:text-green-200 transition-colors">
                          <span className="mr-1 font-semibold">19</span>
                          <TbArrowBigUp size={20} />
                        </div>
                      </Tooltip>
                      <div className="h-full w-[1px] bg-white/10" />
                      <Tooltip text="Downvote">
                        <div className="rounded-r-md h-full px-2 py-1 flex items-center cursor-pointer hover:bg-red-500/50 text-slate-300 hover:text-green-200 transition-colors">
                          <TbArrowBigDown size={20} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <span className="flex items-center">
                    <FaEye size={20} className="mr-1 mt-0.5" />
                    {news.views} views
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt size={18} className="mr-1 mt-0.5" /> {dayjs(news.created_at).fromNow()}
                  </span>
                </div>
                <CommentsSection />
              </>
            )}
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
