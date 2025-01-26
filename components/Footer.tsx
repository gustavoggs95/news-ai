export default function Footer() {
  return (
    <footer className="pb-4 text-gray-200 border-t border-gray-900">
      <div className="max-w-5xl xl:max-w-5xl mx-auto divide-y divide-gray-900 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse justify-between pt-5 pb-4 border-t lg:flex-row bg-top border-black items-center">
          <ul className="flex flex-col space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <li>
              <span className="text-md text-gray-200 hover:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-semibold">
                Copyright © 2025 Flux. All rights reserved.
              </span>
            </li>
          </ul>
          <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row pb-[5px]">
            <div className="flex flex-row items-center justify-between">
              <img
                className="object-cover object-center w-8 h-8 shadow-md mt-1 mr-3"
                alt="Flux Logo"
                src="./images/flux-png.png"
              />
              <a href="/" className="flex text-3xl text-white font-medium">
                Flux
              </a>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
