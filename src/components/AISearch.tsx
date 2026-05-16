"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Play, AlertTriangle, Loader2 } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import SafeImage from "./SafeImage";
import VideoPlayer from "./VideoPlayer";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    setIsLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className="container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group border-white/5"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e50914]/5 via-[#8b5cf6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 relative z-10">
          <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#e50914] to-[#ff4b4b] flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.4)]">
            <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </div>
          <div className="flex-1 w-full relative">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Ask AI: "Sad movies with twists"...'
                className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl py-4 md:py-5 px-6 md:px-8 text-white text-base md:text-lg placeholder-gray-500 focus:outline-none focus:border-[#e50914] focus:ring-4 focus:ring-[#e50914]/10 transition-all backdrop-blur-xl"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                {isLoading && <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-[#e50914] animate-spin" />}
                <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-6 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4">
          {["Action", "Sci-Fi", "Drama", "Anime", "90s"].map((suggestion, idx) => (
            <button 
              key={idx} 
              onClick={() => setQuery(suggestion)} 
              className="snap-start shrink-0 whitespace-nowrap text-[9px] md:text-[10px] uppercase font-black tracking-widest bg-white/5 hover:bg-[#e50914] hover:text-white border border-white/5 rounded-full px-5 py-2.5 text-gray-400 active:scale-95 transition-all duration-300"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Search Results Dropdown/Area */}
        <AnimatePresence mode="wait">
          {showResults && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="mt-8 md:mt-12 border-t border-white/10 pt-8 md:pt-12 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">AI Discovery</h3>
                <button 
                  onClick={() => { setShowResults(false); setQuery(""); }} 
                  className="text-gray-500 hover:text-[#e50914] text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  Clear
                </button>
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                  {results.map((movie) => {
                    const isTV = !movie.title && (movie as any).name;
                    const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
                    return (
                      <motion.div 
                        key={movie.id} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group"
                      >
                        <div 
                          onClick={() => setActiveMovie(movie)}
                          className="relative aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden mb-2 border border-white/5 cursor-pointer shadow-2xl"
                        >
                          <SafeImage 
                            src={getImageUrl(movie.poster_path)} 
                            fallbackSrc={getImageUrl(movie.backdrop_path)}
                            alt={movie.title || (movie as any).name} 
                            fill 
                            sizes="(max-width: 768px) 50vw, 200px"
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#e50914] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.6)] transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              <Play className="fill-white text-white w-5 h-5 md:w-6 md:h-6 ml-1" />
                            </div>
                          </div>
                        </div>
                        <Link href={href} className="block group">
                          <h4 className="text-[11px] md:text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-[#e50914] transition-colors">{movie.title || (movie as any).name}</h4>
                          <p className="text-[9px] text-gray-500 mt-0.5 uppercase font-bold tracking-widest">
                            {movie.release_date?.substring(0,4)} • {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : 'Neural Pick'}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-20">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No matches found in the cinematic cortex.</p>
                    <p className="text-gray-600 text-xs mt-2">Try adjusting your keywords for a better discovery.</p>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {activeMovie && (
        <VideoPlayer 
          movieTitle={activeMovie.title || (activeMovie as any).name} 
          videoId={`tmdb-${activeMovie.id}`} 
          type={(!activeMovie.title && (activeMovie as any).name) ? "tv" : "movie"}
          posterPath={getImageUrl(activeMovie.poster_path, "w500")}
          backdropPath={getImageUrl(activeMovie.backdrop_path, "original")}
          onClose={() => setActiveMovie(null)} 
        />
      )}
    </div>
  );
}

