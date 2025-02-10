// /components/Layout.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
import AppHeader from "components/AppHeader";
import AppSideBar from "components/AppSideBar";
import { NewsModal } from "components/NewsModal";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="app-root">
      <AppHeader />
      <div className="flex h-[calc(100vh-70px)]">
        <ToastContainer theme="dark" />
        <NewsModal />
        <div className="w-64 hidden md:block mt-[70px]">
          <AppSideBar />
        </div>

        <div className="flex-grow p-4 mt-[70px]">
          <div className="text-white body-font mt-10 max-w-2xl sm:max-w-2xl lg:max-w-3xl xl:max-w-6xl xxl:max-w-8xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
