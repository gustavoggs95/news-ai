// /components/Layout.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
import AppHeader from "./AppHeader";
import AppSideBar from "./AppSideBar";
import { NewsModal } from "./NewsModal";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
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
