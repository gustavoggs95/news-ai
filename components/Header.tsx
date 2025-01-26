import React from "react";
import { useRouter } from "next/router";

export default function Header() {
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
          <div className="md:ml-auto md:mr-auto font-4 pt-1 md:pl-14 pl-1 flex flex-wrap items-center md:text-base text-1xl md:justify-center justify-items-start">
            <a
              onClick={() => router.push("/app")}
              className="mr-11 pr-2 cursor-pointer text-gray-300 hover:text-white font-semibold tr04"
            >
              App
            </a>
            {/* <div className="relative">
              <button
                type="button"
                className="
                   group rounded-md text-gray-300 inline-flex items-center text-base font-medium focus:outline-none pb-8'
                  "
                onMouseEnter={() => (setFlyer(!flyer), setFlyerTwo(false))}
              >
                <span className="tr04">Templates</span>
                <svg
                  className={
                    flyer === true
                      ? 'transform rotate-180 ml-3 h-5 w-5 transition ease-out duration-200'
                      : 'ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                onMouseLeave={() => setFlyer(false)}
                className={
                  flyer
                    ? 'opacity-100 translate-y-0 transition ease-out duration-200 absolute z-10 -ml-4 mt-3 g327 border transform px-2 w-screen max-w-sm sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2'
                    : 'hidden opacity-0 translate-y-1 absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2'
                }
              >
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="relative grid gap-6 bg-black px-2 py-6 sm:gap-8 ">
                    <a
                      href="/"
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-800 tr04"
                    >
                      <div className="ml-4">
                        <p className="text-base font-medium text-white">
                          NINE4 TEMPLATE #1
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          First Template
                        </p>
                      </div>
                    </a>
                    <a
                      href="/"
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-800 tr04"
                    >
                      <div className="ml-4">
                        <p className="text-base font-medium text-white">
                          NINE4 TEMPLATE #2
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Second Template
                        </p>
                      </div>
                    </a>
                    <a
                      href="/"
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-800 tr04"
                    >
                      <div className="ml-4">
                        <p className="text-base font-medium text-white">
                          NINE4 TEMPLATE #3
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Third Template
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
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
            <div className="relative inline-flex items-center cursor-pointer" onClick={() => router.push("/app")}>
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
