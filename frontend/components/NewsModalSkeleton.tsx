"use client";

import React from "react";

const NewsModalSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        {/* Empty left spacer */}
        <div className="w-6 h-6 bg-gray-700 rounded" />
        {/* Title placeholder */}
        <div className="w-1/2 h-8 bg-gray-700 rounded" />
        {/* Close button placeholder */}
        <div className="w-6 h-6 bg-gray-700 rounded" />
      </div>

      <div className="w-full p-4 mx-auto space-y-6">
        {/* Image Section */}
        <div className="relative">
          {/* Image placeholder */}
          <div className="w-full h-48 bg-gray-700 rounded" />
          {/* External link icon placeholder */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-gray-600 rounded" />
        </div>

        {/* Rank and Source Row */}
        <div className="flex items-center justify-between">
          {/* RankTag placeholder */}
          <div className="w-20 h-6 bg-gray-700 rounded" />
          {/* Right side with hot icon and source */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-700 rounded-full" />
            <div className="w-16 h-6 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div className="h-4 bg-gray-700 rounded mb-2" />
          <div className="h-4 bg-gray-700 rounded mb-2" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
        </div>

        {/* Meta Data (Upvote/Downvote, Views, Date) */}
        <div className="flex space-x-5">
          <div className="flex">
            <div className="bg-gray-700 rounded-md flex">
              {/* Upvote placeholder */}
              <div className="rounded-l-md px-2 py-1 bg-gray-700" />
              {/* Divider */}
              <div className="h-full w-[1px] bg-gray-600" />
              {/* Downvote placeholder */}
              <div className="rounded-r-md px-2 py-1 bg-gray-700" />
            </div>
          </div>
          {/* Views placeholder */}
          <div className="w-16 h-6 bg-gray-700 rounded" />
          {/* Date placeholder */}
          <div className="w-20 h-6 bg-gray-700 rounded" />
        </div>

        {/* Comments Section Placeholder */}
        <div className="space-y-3">
          {/* Simulate a few comment skeletons */}
          <div className="h-20 bg-gray-700 rounded" />
          <div className="h-20 bg-gray-700 rounded" />
          <div className="h-20 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default NewsModalSkeleton;
