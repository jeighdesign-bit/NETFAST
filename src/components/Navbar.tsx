"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Menu, X, AlertTriangle, ChevronDown, TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
      }`}
    >
      {/* Premium Notification Bar */}
      <AnimatePresence>
        {!isScrolled && !isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gradient-to-r from-[#e50914] to-[#ff4b4b] py-1 md:py-1.5 overflow-hidden"
          >
            <div className="container mx-auto px-6 flex items-center justify-center gap-3">
              <AlertTriangle className="w-3 h-3 text-white animate-pulse" />
              <p className="text-[9px] md:text-xs text-white font-black uppercase tracking-[0.1em]">
                Optimal Experience: Use <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer" className="font-bold border-b border-white/50 hover:text-black hover:bg-white transition-all px-1">uBlock Origin</a> (PC) or <a href="https://brave.com/download/" target="_blank" rel="noopener noreferrer" className="font-bold border-b border-white/50 hover:text-black hover:bg-white transition-all px-1">Brave</a> (Mobile)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 lg:gap-10">
          <div className="flex items-center gap-5 md:gap-7">
            {pathname !== "/" && (
              <button 
                onClick={() => router.back()}
                className="group flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full md:rounded-[14px] bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-white/25 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
              </button>
            )}
            <div className="relative group">
              {/* Subtle ambient glow behind logo */}
              <div className="absolute inset-0 bg-[#e50914]/20 blur-2xl rounded-full scale-[1.8] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              <Link href="/" className="relative text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#ff4b4b] shrink-0 drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]" style={{ fontFamily: "var(--font-outfit)" }}>
                NETFAST
              </Link>
            </div>
          </div>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400 tracking-wide uppercase">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-white transition-colors duration-300">
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
                BROWSE <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isBrowseOpen ? 'rotate-180' : ''}`} />
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
        
        <div className="flex items-center gap-2 md:gap-6">
          {/* Search Section */}
          <div className="flex items-center relative group">
            <AnimatePresence>
              {(isSearchVisible || !isMobileMenuOpen) && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: isSearchVisible || !isMobileMenuOpen ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "140px" : "240px") : 0, 
                    opacity: 1 
                  }}
                  onSubmit={handleSearch} 
                  className={`flex items-center relative ${isSearchVisible ? 'flex' : 'hidden md:flex'}`}
                >
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres..."
                    className="bg-black/40 border border-white/20 rounded-full py-1.5 md:py-2 pl-9 md:pl-10 pr-4 text-[10px] md:text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:bg-black/60 transition-all w-full backdrop-blur-md"
                    autoFocus={isSearchVisible}
                    onBlur={() => { if (!searchQuery) setIsSearchVisible(false); }}
                  />
                  <Search className="absolute left-3 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                </motion.form>
              )}
            </AnimatePresence>
            
            <button 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors ml-1"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              {!isSearchVisible && <Search className="w-5 h-5" />}
            </button>
          </div>

          <button 
            className="text-white p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7 md:w-8 md:h-8" /> : <Menu className="w-7 h-7 md:w-8 md:h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-2xl md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen p-8 pt-28 pb-12">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-12 p-4 rounded-3xl bg-white/5 border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e50914] to-[#ff4b4b] flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">Guest User</h3>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">Cinematic Explorer</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-6 mb-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-4xl font-black tracking-tighter transition-all block ${
                        pathname === link.href ? "text-[#e50914] translate-x-4" : "text-gray-600 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Browse Categories */}
              <div className="grid grid-cols-2 gap-4">
                {browseItems.map((item, i) => {
                  const icons: Record<string, any> = { TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio };
                  const Icon = icons[item.icon];
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (i * 0.05) }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#e50914] transition-colors">
                          {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">{item.name}</span>
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
