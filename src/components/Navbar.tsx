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
      setIsScrolled(window.scrollY > 50);
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-black/90 backdrop-blur-md shadow-[0_0_15px_rgba(229,9,20,0.2)]" : "bg-transparent"
      }`}
    >
      {/* Global Experience Notice Bar */}
      <div className="w-full bg-yellow-500 py-1.5 z-[100] relative">
        <div className="container mx-auto px-6 flex items-center justify-center gap-3">
          <AlertTriangle className="w-3.5 h-3.5 text-black animate-pulse" />
          <p className="text-[10px] md:text-xs text-black font-black uppercase tracking-[0.15em]">
            No Ads: Use{" "}
            <span className="underline decoration-black/30">uBlock Origin</span> (PC) or{" "}
            <span className="underline decoration-black/30">Brave Browser</span> (Mobile)
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {pathname !== "/" && (
              <button 
                onClick={() => router.back()}
                className="text-white hover:text-[#e50914] transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <Link href="/" className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#ff4b4b] neon-text shrink-0" style={{ fontFamily: "var(--font-outfit)" }}>
              NETFAST
            </Link>
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
        
        <div className="flex items-center gap-6 text-gray-300">
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e50914]/50 focus:bg-white/10 transition-all w-40 focus:w-64"
            />
            <Search className="absolute left-3 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </form>

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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505] z-[200] overflow-y-auto pt-24 px-6 pb-12"
          >
            <div className="flex flex-col gap-8">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, tv shows..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-white font-bold focus:outline-none focus:border-[#e50914] transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </form>

              {/* Primary Links */}
              <div className="grid grid-cols-2 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-[#e50914]/30 transition-all group"
                  >
                    <span className="text-lg font-black text-white group-hover:text-[#e50914] transition-colors">{link.name}</span>
                  </Link>
                ))}
              </div>

              {/* Browse Categories Grid */}
              <div>
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-2">Discover Content</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {browseItems.map((item) => {
                    const icons: Record<string, any> = { TrendingUp, Star, Globe, Calendar, Clock, Tag, Layers, Monitor, PlayCircle, Radio };
                    const Icon = icons[item.icon];
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#e50914]/10 text-[#e50914] flex items-center justify-center">
                          {Icon && <Icon className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Experience Instruction */}
              <div className="p-5 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold mb-1">Stream Optimally</p>
                  <p className="text-gray-400 text-[10px] leading-tight">
                    For zero ads, use <span className="text-yellow-500 font-bold">uBlock Origin</span> or the <span className="text-yellow-500 font-bold">Brave Browser</span>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}
