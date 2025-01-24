export default function Footer() {
  return (
    <footer className="pb-4 text-gray-200 border-t border-gray-900">
      <div className="max-w-5xl xl:max-w-5xl mx-auto divide-y divide-gray-900 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse justify-between pt-5 pb-4 border-t lg:flex-row bg-top border-black items-center">
          <ul className="flex flex-col space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <li>
              <span
                href="/"
                className="text-md text-gray-200 hover:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold"
              >
                Copyright © 2025 Flux Daily. All rights reserved.
              </span>
            </li>
          </ul>
          <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row pb-[5px]">
            <div className="flex flex-row items-center justify-between">
              <img
                className="object-cover object-center w-8 h-8 shadow-md mt-1.5 mr-3"
                alt="Flux Logo"
                src="./images/flux-png.png"
              />
              <a
                href="/"
                className="flex text-3xl text-white font-medium mb-4 md:mb-0"
              >
                Flux Daily
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
          </ul>
        </div>
      </div>
    </footer>
  );
}
