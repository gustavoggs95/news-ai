"use client";

import { useState } from "react";

export default function CreateNews() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { title, url });
    // Here you would typically send the data to an API or perform some action
  };

  return (
    <div className="w-full p-4 mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-10">
          <div className="space-y-2 flex flex-col">
            <label htmlFor="title" className="font-medium text-gray-300">
              Title
            </label>
            <input
              id="news-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title"
              required
              className="rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-gray-700 bg-slate-200"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label htmlFor="url" className="font-medium text-gray-300">
              URL
            </label>
            <input
              id="news-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
              required
              className="rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-gray-700 bg-slate-200"
            />
          </div>
        </div>
        <div>
          {/* <button type="submit" className="w-full">
            Submit
          </button> */}
          <div className="relative inline-flex items-center cursor-pointer w-full" onClick={() => {}}>
            <a className="justify-center w-full inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 px-14 py-3 font-semibold tracking-tighter text-white transition-transform duration-1000 ease-in-out transform hover:scale-105 focus:shadow-outline">
              <div className="flex text-lg">
                <span className="justify-center">Create News</span>
              </div>
            </a>
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-lg"></div>
          </div>
        </div>
      </form>
    </div>
  );
}
