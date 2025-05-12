'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react'; // or your auth hook
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderBlurred, setIsHeaderBlurred] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsHeaderBlurred(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeaderBlurred
          ? 'bg-gray-900/80 backdrop-blur-md border-b border-white/10'
          : ''
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
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

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-6">
          <Link href="/forms" className="nav-link">Forms</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/about" className="nav-link">About</Link>
        </nav>

        {/* Right side: auth or login/signup */}
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/account" className="hidden sm:block">
              <UserCircleIcon className="h-8 w-8 text-gray-200 hover:text-white" />
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="btn-text hidden sm:block">Login</Link>
              <Link href="/sign-up" className="btn-primary hidden sm:block">
                Sign Up
              </Link>
            </>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded p-1"
          >
            {/* hamburger icon */}
          </button>
        </div>
      </div>

      {/* Mobile menu (same auth logic inside) */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pb-4 bg-gray-900/80 backdrop-blur-md border-b border-t border-white/10"
        >
          <div className="flex flex-col space-y-3 px-4 py-2">
            <Link href="/forms" className="mobile-link">Forms</Link>
            <Link href="/pricing" className="mobile-link">Pricing</Link>
            <Link href="/about" className="mobile-link">About</Link>
            {session ? (
              <Link href="/account" className="mobile-link flex items-center gap-2">
                <UserCircleIcon className="h-6 w-6 text-gray-200" />
                My Account
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="mobile-link">Login</Link>
                <Link href="/sign-up" className="mobile-cta">Sign Up</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
