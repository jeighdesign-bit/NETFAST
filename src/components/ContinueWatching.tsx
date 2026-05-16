"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, X, Film, Tv } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";

interface ContinueItem {
  id: string;
  tmdbId: string;
  title: string;
  posterPath: string;
  backdropPath?: string;
  progress: number;
  duration: number;
  timestamp: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadItems = () => {
    const saved: ContinueItem[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith("netfast_progress_")) {
        const videoId = key.replace("netfast_progress_", "");
        const info = localStorage.getItem(`netfast_info_${videoId}`);
        const progress = parseFloat(localStorage.getItem(key) || "0");
        const duration = parseFloat(localStorage.getItem(`netfast_duration_${videoId}`) || "7200");
        const timestamp = parseInt(localStorage.getItem(`netfast_time_${videoId}`) || "0");
        
        if (info && progress > 30) { // Only show if watched for more than 30 seconds
          const parsed = JSON.parse(info);
          // Only show if not nearly finished (e.g., less than 95%)
          if ((progress / duration) < 0.95) {
            saved.push({
              id: videoId,
              tmdbId: videoId.replace('tmdb-', '').split('-')[0],
              title: parsed.title,

              posterPath: parsed.posterPath,
              backdropPath: parsed.backdropPath,
              progress,
              duration,
              timestamp,
              type: parsed.type || "movie",
              season: parsed.season,
              episode: parsed.episode
            });
          }
        }
      }
    });

    setItems(saved.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10));
    setIsLoaded(true);
  };

  useEffect(() => {
    loadItems();
    // Refresh when localstorage changes (other tabs or player closing)
    window.addEventListener('storage', loadItems);
    return () => window.removeEventListener('storage', loadItems);
  }, []);

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem(`netfast_progress_${id}`);
    localStorage.removeItem(`netfast_info_${id}`);
    localStorage.removeItem(`netfast_time_${id}`);
    localStorage.removeItem(`netfast_duration_${id}`);
    loadItems();
  };

  if (!isLoaded || items.length === 0) return null;

  return (
    <div className="py-12 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#e50914] rounded-full" />
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
            Continue Watching
          </h2>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-widest">
          <Clock className="w-4 h-4" />
          <span>Recent Activity</span>
        </div>
      </div>

      <div className="relative group">
        <div className="flex gap-4 md:gap-6 overflow-x-auto px-6 pb-8 hide-scrollbar scroll-smooth snap-x snap-mandatory">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                className="flex-none w-[280px] md:w-[380px] snap-start active:scale-95 transition-transform duration-300"
              >
                <Link 
                  href={`/${item.type}/${item.tmdbId}${item.type === 'tv' ? `?s=${item.season}&e=${item.episode}` : ''}`} 
                  className="block relative group/card"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl">
                    <SafeImage
                      src={item.posterPath}
                      fallbackSrc={item.backdropPath}
                      alt={item.title}
                      fill
                      className="object-cover opacity-60 group-hover/card:opacity-90 transition-all duration-500 group-hover/card:scale-110"
                    />
                    
                    {/* Overlay Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 backdrop-blur-md">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.progress / item.duration) * 100}%` }}
                        className="h-full bg-[#e50914] shadow-[0_0_15px_rgba(229,9,20,0.8)]" 
                      />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform scale-50 group-hover/card:scale-100">
                      <div className="w-16 h-16 rounded-full bg-[#e50914] flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.5)]">
                        <Play className="fill-white text-white w-8 h-8 ml-1" />
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                        {item.type === 'movie' ? <Film className="w-3 h-3 text-[#e50914]" /> : <Tv className="w-3 h-3 text-[#e50914]" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          {item.type === 'tv' ? `S${item.season} E${item.episode}` : 'Movie'}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={(e) => removeItem(e, item.id)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-red-500/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors group/remove"
                    >
                      <X className="w-4 h-4 text-white group-hover/remove:scale-110 transition-transform" />
                    </button>

                    {/* Bottom Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-black text-lg tracking-tight line-clamp-1 group-hover/card:text-[#e50914] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                        {Math.floor(item.progress / 60)}m left to finish
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

