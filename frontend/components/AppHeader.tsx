"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const SingleFlowSignIn = dynamic(() => import("./SingleFlowSignIn"), { ssr: false });

export default function AppHeader() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full clearNav z-50 h-[70px]">
      <div className="mx-auto flex flex-wrap px-3 py-2 flex-row md:flex-ro w-full justify-between h-full">
        <div className="flex flex-row items-center p-3 md:p-1 mt-0.5">
          <img
            className="object-cover object-center h-9 w-9 shadow-md mr-3"
            alt="Flux Logo"
            src="./images/flux-png.png"
          />
          <a href="/" className="flex text-3xl text-white font-medium">
            Flux
          </a>
          <button
            className="text-white pb-4 cursor-pointer leading-none px-3 py-1 md:hidden outline-none focus:outline-none content-end ml-auto"
            type="button"
            aria-label="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={"md:flex items-center"}>
          <SingleFlowSignIn />
        </div>
      </div>
    </header>
  );
}
