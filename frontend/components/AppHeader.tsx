"use client";

import React, { useEffect, useState } from "react";
import { ProfileModal } from "./ProfileModal";
import SingleFlowSignIn from "./SingleFlowSignIn";

// const SingleFlowSignIn = dynamic(() => import("./SingleFlowSignIn"), { ssr: false });

export default function AppHeader() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <header className="fixed top-0 left-0 right-0 w-full clearNav z-50 h-[70px]">
      <ProfileModal />
      <div className="mx-auto flex flex-wrap px-3 py-2 flex-row md:flex-ro w-full justify-between h-full">
        <div className="flex flex-row items-center p-3 md:p-1 mt-0.5">
          <img
            className="object-cover object-center h-9 w-9 shadow-md mr-3"
            alt="Flux Logo"
            src="/images/flux-png.png"
          />
          <a href="/app" className="flex text-3xl text-white font-medium">
            Flux
          </a>
        </div>
        <div className={"md:flex items-center"}>{isClient && <SingleFlowSignIn />}</div>
      </div>
    </header>
  );
}
