'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderBlurred, setIsHeaderBlurred] = useState(false);

  useEffect(() => {
    const updateHeaderBackground = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderBlurred(scrollPosition > 10);
    };

    window.addEventListener('scroll', updateHeaderBackground);
    return () => window.removeEventListener('scroll', updateHeaderBackground);
  }, []);

  return (
    <header
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHeaderBlurred ? 'bg-gray-900/80 backdrop-blur-md border-b border-white/10' : ''
        }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#19F6E8]"
            >
              <path
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12h6M12 9v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold text-white">HIPAAForms</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/forms" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Forms</Link>
          <Link href="/pricing" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Pricing</Link>
          <Link href="/about" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="hidden sm:block text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Login</Link>
          <Link href="/sign-up" className="hidden sm:block px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#19F6E8] transition">Sign Up</Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded p-1"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pb-4 bg-gray-900/80 backdrop-blur-md border-b border-t border-white/10"
        >
          <div className="flex flex-col space-y-3 px-4 py-2">
            <Link href="/forms" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Forms</Link>
            <Link href="/pricing" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Pricing</Link>
            <Link href="/about" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">About</Link>
            <Link href="/sign-in" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Login</Link>
            <Link href="/sign-up" className="px-4 py-2 w-full text-center rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#19F6E8] transition">Sign Up</Link>
          </div>
        </motion.div>
      )}
    </header>
  );
} 