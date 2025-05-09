'use client'

import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function CTAButtons() {
  return (
    <div className="flex flex-row w-full sm:w-auto overflow-hidden rounded-full shadow-lg">
      {/* Left button */}
      <input
        type="search"
        placeholder="Search..."
        className="h-10 sm:h-12 flex-grow bg-white hover:bg-gray-50 text-gray-900 placeholder-gray-500 font-medium py-2 sm:py-3 px-6 transition-all duration-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {/* Right button */}
      <a 
        href="/forms" 
        className="bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium text-sm sm:text-base py-2 sm:py-3 px-2 flex items-center justify-center gap-2 transition-all duration-300 border-l border-gray-700/50"
      >
        Browse Forms
        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
} 