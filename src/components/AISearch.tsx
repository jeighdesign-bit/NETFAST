"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Play } from "lucide-react";
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

  const handleSearch = async (searchQuery?: string) => {
    const term = searchQuery || query;
    if (!term) return;
    
    setIsLoading(true);
    setShowResults(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(term)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass p-6 rounded-2xl relative overflow-hidden group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e50914]/10 via-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-tr from-[#e50914] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 w-full relative">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "sad anime with romance" or "mind blowing plot twist movies"...'
                className="w-full bg-black/50 border border-white/20 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 bg-[#e50914] hover:bg-[#ff4b4b] rounded-lg px-6 flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                AI Search
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar pb-2">
          {["movies where aliens invade earth", "movies for lonely nights", "similar to Interstellar"].map((suggestion, idx) => (
            <button 
              key={idx} 
              onClick={() => { setQuery(suggestion); handleSearch(suggestion); }} 
              className="whitespace-nowrap text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 text-gray-300 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Search Results Dropdown/Area */}
        <AnimatePresence>
          {showResults && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 border-t border-white/10 pt-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Discovery Results</h3>
                <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-white text-sm">Clear</button>
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.map((movie) => {
                    const isTV = !movie.title && (movie as any).name;
                    const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
                    return (
                      <div key={movie.id} className="group block">
                        <div 
                          onClick={() => setActiveMovie(movie)}
                          className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border border-white/5 cursor-pointer"
                        >
                          <SafeImage 
                            src={getImageUrl(movie.poster_path)} 
                            alt={movie.title || (movie as any).name} 
                            fill 
                            sizes="(max-width: 768px) 50vw, 150px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="fill-white text-white w-8 h-8" />
                          </div>
                        </div>
                        <Link href={href} className="block">
                          <h4 className="text-sm font-medium text-gray-200 line-clamp-1 group-hover:text-[#e50914] transition-colors">{movie.title || (movie as any).name}</h4>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !isLoading && <p className="text-gray-500 text-center py-10">No matches found in the cinematic cortex.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {activeMovie && (
        <VideoPlayer 
          movieTitle={activeMovie.title || (activeMovie as any).name} 
          videoId={`tmdb-${activeMovie.id}`} 
          onClose={() => setActiveMovie(null)} 
        />
      )}
    </div>
  );
}
