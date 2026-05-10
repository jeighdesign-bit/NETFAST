"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Menu, X, AlertTriangle } from "lucide-react";
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
      {/* Experience Notice Bar */}
      <div className="w-full bg-yellow-500 py-1.5 z-[100] relative">
        <div className="container mx-auto px-6 flex items-center justify-center gap-3">
          <AlertTriangle className="w-4 h-4 text-black animate-bounce" />
          <p className="text-[10px] md:text-xs text-black font-black uppercase tracking-widest">
            For best experience, use <span className="underline">uBlock Origin</span> or <span className="underline">Brave Browser</span>
          </p>
        </div>
      </div>
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
        
        <div className="flex items-center gap-4 text-gray-300">
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            {/* Experience Instruction */}
            <div className="mt-12 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-500/80 shrink-0" />
              <p className="text-gray-400 text-xs font-medium">
                For best experience, use <span className="font-bold text-white">uBlock Origin</span> or <span className="font-bold text-white">Brave Browser</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
