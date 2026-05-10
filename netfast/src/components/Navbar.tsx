"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "AI Discover", href: "/ai-discover" },
    { name: "Movies", href: "/movies" },
    { name: "Anime", href: "/anime" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-black/90 backdrop-blur-md shadow-[0_0_15px_rgba(229,9,20,0.2)]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#ff4b4b] neon-text shrink-0" style={{ fontFamily: "var(--font-outfit)" }}>
            NETFAST
          </Link>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400 tracking-wide uppercase">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6 text-gray-300">
          <Search className="w-5 h-5 hover:text-[#e50914] transition cursor-pointer hidden sm:block" />
          <Bell className="w-5 h-5 hover:text-[#e50914] transition cursor-pointer hidden sm:block" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e50914] to-[#8b5cf6] flex items-center justify-center cursor-pointer hover:shadow-[0_0_10px_rgba(229,9,20,0.8)] transition">
            <User className="w-4 h-4 text-white" />
          </div>
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10 px-6 py-8"
          >
            <ul className="flex flex-col space-y-6 text-xl font-bold">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#e50914] transition"
                >
                  {link.name}
                </Link>
              ))}
            </ul>
            <div className="mt-10 flex gap-6 text-gray-400">
              <Search className="w-6 h-6" />
              <Bell className="w-6 h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
