'use client'

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function CTAButtons() {
  return (
    <div className="flex flex-row w-full sm:w-auto overflow-hidden rounded-full shadow-lg">
      {/* Left button */}
      <Link 
        href="/pricing" 
        className="group flex-grow bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 transition-all duration-300 btn-glow"
      >
        View Pricing Plans
      </Link>
      
      {/* Right button */}
      <Link 
        href="/forms" 
        className="bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300 border-l border-gray-700/50"
      >
        Browse Forms
        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
} 