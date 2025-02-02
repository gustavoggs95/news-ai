import React, { useEffect, useState } from "react";
import { FaHistory, FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import CreateNews from "./CreateNews";

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

Modal.setAppElement("#__next");

export default function AppSideBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    Modal.setAppElement("#__next");
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
        <div className="flex justify-between items-center p-4">
          <div />
          <h1 className="font-semibold text-white/80">Creating post</h1>
          <IoMdClose
            size={26}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <CreateNews onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="p-4 text-lg font-bold text-white/50">Menu</div>
      <ul className="flex-grow">
        <li className="px-4 mb-4 flex items-center">
          <div className="relative flex cursor-pointer w-full" onClick={() => setIsModalOpen(true)}>
            <a className="inline-flex justify-center items-center rounded-lg bg-gradient-to-r w-full from-blue-500 to-blue-800 px-2 py-2 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline">
              <div className="flex text-lg items-center">
                <FaPlus className="mr-2" size={16} />
                <span className="justify-center">New post</span>
              </div>
            </a>
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
          </div>
        </li>
        <li className="p-4 hover:bg-gray-700 flex items-center cursor-pointer">
          <FaHistory className="mr-2" />
          History
        </li>
      </ul>
    </div>
  );
}
