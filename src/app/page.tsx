'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero.client";
import WhyChoose from "../components/WhyChoose.client";
import dynamic from "next/dynamic";

// This ensures the WebGL code only runs in the browser
const GodRays = dynamic(() => import('../components/VolumetricGodRays.client'), {
  ssr: false
})

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderBlurred, setIsHeaderBlurred] = useState(false);

  // Handle header background on scroll
  useEffect(() => {
    const updateHeaderBackground = () => {
      const scrollPosition = window.scrollY;
      setIsHeaderBlurred(scrollPosition > 10);
    };

    window.addEventListener('scroll', updateHeaderBackground);
    return () => window.removeEventListener('scroll', updateHeaderBackground);
  }, []);

 
// </div>
  return (
    <div className="flex flex-col min-h-screen justify-center">
      <div className="absolute inset-0 bg-[#000A17] z-0 w-full h-full">
      <GodRays />
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.03,
        }}
      />
      </div>

      <div className="absolute bottom-0 left-0 h-[100vh] overflow-hidden pointer-events-none z-20 translate-x-[-25%]">
        <svg
          className="w-full h-full "
          style={{
            transform: 'perspective(600px) rotateX(75deg)',
            transformOrigin: 'bottom'
          }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,221,255,0.1)" strokeWidth="2"  />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Navigation */}
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
            <Link href="/login" className="hidden sm:block text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Login</Link>
            <Link href="/signup" className="hidden sm:block px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#19F6E8] transition">Sign Up</Link>
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
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-3 px-4">
              <Link href="/forms" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Forms</Link>
              <Link href="/pricing" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Pricing</Link>
              <Link href="/about" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">About</Link>
              <Link href="/login" className="text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#19F6E8] rounded px-2 py-1 transition">Login</Link>
              <Link href="/signup" className="px-4 py-2 w-full text-center rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#19F6E8] transition">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </header>
      {/* Main Content */}
      <main className={`relative flex-grow bg-transparent text-white z-30`}>
        <Hero />
        <WhyChoose />
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HIPAAForms.org</h3>
              <p className="text-gray-400 text-sm">Secure, compliant healthcare forms for medical professionals.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/forms" className="text-gray-400 hover:text-white transition text-sm">Form Library</Link></li>
                <li><Link href="/hipaa-guide" className="text-gray-400 hover:text-white transition text-sm">HIPAA Guide</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition text-sm">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <p className="text-gray-400 text-sm mb-2">All form data is handled in a HIPAA-compliant manner.</p>
              <p className="text-gray-400 text-sm">© 2023 HIPAAForms.org. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
