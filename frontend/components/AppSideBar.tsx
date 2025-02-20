"use client";

import React, { useEffect, useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { PiNewspaperClipping } from "react-icons/pi";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateNews from "./CreateNewsModal";

// Import usePathname

const customStyles: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    transition: "opacity 0.3s ease-in-out",
    zIndex: 20,
    width: "600px",
    borderRadius: "20px",
    backgroundColor: "#1f2937",
    color: "white",
    borderColor: "rgba(255,255,255,0.2)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.3s ease-in-out",
  },
};

export default function AppSideBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    Modal.setAppElement("#app-root");
  }, []);

  return (
    <div className="fixed w-64 h-full border-r border-white/20 text-white flex flex-col">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="News Modal"
        closeTimeoutMS={250}
      >
        <div className="flex justify-center items-center p-4 relative">
          <h1 className="font-semibold text-white/80">Creating post</h1>
          <IoMdClose
            size={26}
            className="cursor-pointer text-white/80 hover:text-white transition-colors absolute right-3"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <CreateNews onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="p-4 text-lg font-bold text-white/50">Menu</div>
      <ul className="flex-grow">
        <li className="px-4 mb-4 flex items-center">
          <div className="relative flex cursor-pointer w-full" onClick={() => setIsModalOpen(true)}>
            <button className="inline-flex justify-center items-center rounded-lg bg-gradient-to-r w-full from-blue-500 to-blue-800 px-2 py-2 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline">
              <div className="flex text-lg items-center">
                <FaPlus className="mr-2" size={16} />
                <span className="justify-center">New post</span>
              </div>
            </button>
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
          </div>
        </li>
        <li
          className={`flex items-center cursor-pointer transition hover:bg-gray-700/50 ${pathname === "/app" && "bg-gray-700/40"}`}
        >
          <Link href="/app" className="h-full p-4 w-full flex items-center">
            <HiOutlineHome size={25} className="mr-2" />
            Home
          </Link>
        </li>
        <li
          className={`flex items-center transition cursor-pointer hover:bg-gray-700/50 ${pathname === "/app/purchases" && "bg-gray-700/40"}`}
        >
          <Link href="/app/purchases" className="h-full p-4 w-full flex items-center" prefetch>
            <BiPurchaseTag size={25} className="mr-2" />
            Purchases
          </Link>
        </li>
        <li
          className={`flex items-center transition cursor-pointer hover:bg-gray-700/50 ${pathname === "/app/posts" && "bg-gray-700/40"}`}
        >
          <Link href="/app/posts" className="h-full p-4 w-full flex items-center" prefetch>
            <PiNewspaperClipping size={25} className="mr-2" />
            My Posts
          </Link>
        </li>
      </ul>
    </div>
  );
}
