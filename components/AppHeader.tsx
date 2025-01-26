import React from "react";
import { useRouter } from "next/router";

export default function AppHeader() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full clearNav z-50">
      <div className="max-w-5xl mx-auto flex flex-wrap p-5 flex-col md:flex-row">
        <div className="flex flex-row items-center justify-between p-3 md:p-1">
          <img
            className="object-cover object-center w-8 h-8 shadow-md mt-1.5 mr-3"
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
        <div className={"md:flex flex-grow items-center" + (navbarOpen ? " flex" : " hidden")}>
          <div
            onClick={() => router.push("/")}
            className="md:ml-auto md:mr-auto font-4 pt-1 md:pl-14 pl-1 flex flex-wrap items-center md:text-base text-1xl md:justify-center justify-items-start"
          >
            <a className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">Home</a>
            <a className="mr-12 md:ml-11 ml-0 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">
              Pricing
            </a>
            <a className="mr-12 md:ml-11 cursor-pointer text-gray-300 hover:text-white font-semibold tr04">Careers</a>
          </div>
          <a href="https://x.com/" rel="noopener noreferrer" target="_blank" className="invisible md:visible mr-6">
            <img src="/images/x.svg" className="w-6 h-6 cursor-pointer" />
          </a>
          <a
            href="https://discord.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="invisible md:visible mr-6"
          >
            <img src="/images/discord.svg" className="w-6 h-6 cursor-pointer" />
          </a>
          <div className="text-center">
            <div className="relative inline-flex items-center cursor-pointer">
              <a
                className="inline-flex items-center rounded-lg bg-gradient-to-r bg-white px-6 py-1 font-semibold tracking-tighter text-gray-700 transition-transform ease-in-out transform hover:scale-105 focus:shadow-outline"
                href="/"
              >
                <div className="flex text-lg">
                  <span className="justify-center">Log In</span>
                </div>
              </a>
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
