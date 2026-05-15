"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X, ChevronDown, TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/movies?type=tv" },
    { name: "New", href: "/movies?sort=new" },
  ];

  const browseItems = [
    { name: "Trending", href: "/movies?sort=trending", icon: "TrendingUp" },
    { name: "Top Rated", href: "/movies?sort=top_rated", icon: "Star" },
    { name: "Upcoming", href: "/movies?sort=upcoming", icon: "Clock" },
    { name: "Now Playing", href: "/movies?sort=now_playing", icon: "PlayCircle" },
    { name: "Airing Today", href: "/movies?sort=airing_today", icon: "Radio" },
    { name: "2026 Movies", href: "/movies?year=2026", icon: "Calendar" },
    { name: "Networks", href: "/movies?network=213", icon: "Monitor" },
    { name: "Collections", href: "/movies?genre=28", icon: "Layers" },
    { name: "New Releases", href: "/movies?sort=new", icon: "Tag" },
    { name: "All Genres", href: "/movies", icon: "Globe" },
  ];

  const [isBrowseOpen, setIsBrowseOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? "z-[9999]" : "z-[1000]"
      } ${
        isScrolled ? "bg-black/85 backdrop-blur-xl border-b border-white/5" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      }`}
    >
      {/* Main Navbar Row */}
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
        {/* Left: Back + Logo + Desktop Nav */}
        <div className="flex items-center gap-4 lg:gap-10">
          <div className="flex items-center gap-3 md:gap-5">
            {pathname !== "/" && (
              <button
                onClick={() => router.back()}
                className="group flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all duration-300 active:scale-90"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            )}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#e50914]/20 blur-2xl rounded-full scale-[1.8] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <Link href="/" className="relative shrink-0 flex items-center">
                <img
                  src="/navbar-logo.png"
                  alt="NETFAST Logo"
                  className="w-[100px] md:w-[150px] h-6 md:h-10 object-cover object-center drop-shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400 tracking-wide uppercase">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`hover:text-white transition-colors duration-300 ${pathname === link.href ? "text-white" : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Browse Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setIsBrowseOpen(true)}
              onMouseLeave={() => setIsBrowseOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-white transition-colors duration-300">
                BROWSE <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isBrowseOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isBrowseOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-[400px] bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100]"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {browseItems.map((item) => {
                        const icons: Record<string, any> = { TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio };
                        const Icon = icons[item.icon];
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#e50914] group-hover:text-white transition-all">
                              {Icon && <Icon className="w-4 h-4" />}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>

        {/* Right: Search + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres..."
              className="bg-black/40 border border-white/20 rounded-full py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:bg-black/60 transition-all w-[200px] xl:w-[240px] backdrop-blur-md"
            />
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          </form>

          {/* Mobile Search Icon */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white active:scale-90 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col p-6 pt-16"
          >
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-white font-black text-2xl uppercase tracking-tighter mb-8">Search</h2>

            <form onSubmit={handleSearch} className="relative">
              <input
                ref={mobileSearchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Movies, TV shows, actors..."
                className="w-full bg-white/5 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-base font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:bg-white/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#e50914] text-white px-5 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all"
              >
                Go
              </button>
            </form>

            {/* Quick links */}
            <div className="mt-8">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Quick Browse</p>
              <div className="grid grid-cols-2 gap-3">
                {["Trending", "Top Rated", "Anime", "Horror", "Pinoy", "Comedy"].map((cat) => {
                  const hrefs: Record<string, string> = {
                    Trending: "/movies?sort=trending",
                    "Top Rated": "/movies?sort=top_rated",
                    Anime: "/movies?genre=16",
                    Horror: "/movies?genre=27",
                    Pinoy: "/movies?lang=tl",
                    Comedy: "/movies?genre=35",
                  };
                  return (
                    <Link
                      key={cat}
                      href={hrefs[cat]}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-gray-300 hover:bg-[#e50914] hover:text-white hover:border-[#e50914] transition-all active:scale-95 text-center"
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-[9998] bg-black/97 backdrop-blur-2xl lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen p-6 pt-24 pb-12">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e50914] to-[#ff4b4b] flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">Guest User</h3>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">Cinematic Explorer</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center text-3xl font-black tracking-tighter transition-all py-2 px-3 rounded-xl block ${
                        pathname === link.href
                          ? "text-[#e50914] bg-[#e50914]/10"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />

              {/* Browse Categories - 2 columns, bigger touch targets */}
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Browse</p>
              <div className="grid grid-cols-2 gap-3">
                {browseItems.map((item, i) => {
                  const icons: Record<string, any> = { TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio };
                  const Icon = icons[item.icon];
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-[#e50914]/20 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#e50914] transition-colors shrink-0">
                          {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-white" />}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white leading-tight">{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
