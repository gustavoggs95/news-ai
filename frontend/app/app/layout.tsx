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
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
