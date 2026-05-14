"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import VideoPlayer from "./VideoPlayer";
import { Movie, getImageUrl } from "@/lib/tmdb";

export default function HeroBanner({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying || !movies || movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000); // 8 seconds per slide
    
    return () => clearInterval(interval);
  }, [isPlaying, movies]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];
  const isTV = !movie.title && (movie as any).name;
  const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <>
      <div className="relative w-full h-[85vh] md:h-[90vh] flex items-center overflow-hidden">
        {/* Background with overlay */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`bg-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
            <SafeImage
              src={getImageUrl(movie.backdrop_path, "original")}
              alt={movie.title || (movie as any).name}
              fill
              priority
              quality={90}
              className="object-cover opacity-90 md:opacity-100"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-6 relative z-20 flex items-center h-full pt-16 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl w-full"
            >
            <div className="inline-block px-3 py-1 mb-3 md:mb-4 rounded-full glass border border-[#e50914]/50 text-[#ff4b4b] text-[9px] md:text-xs font-bold tracking-widest uppercase">
              #1 Trending Worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 text-white drop-shadow-2xl leading-[1.1] md:leading-[0.9] uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              {movie.title || (movie as any).name}
            </h1>
            <p className="text-xs md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg leading-relaxed line-clamp-3 md:line-clamp-none">
              {movie.overview}
            </p>

            <div className="flex items-center gap-3 md:gap-4 mt-2 w-full md:w-auto">
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-white text-black hover:bg-gray-200 px-4 md:px-8 py-3.5 md:py-3.5 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
              >
                <Play className="fill-current w-5 h-5 md:w-6 md:h-6" /> Play
              </button>
              <Link 
                href={href}
                className="flex-1 md:flex-none flex items-center justify-center gap-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/10 hover:border-white/20 text-white px-4 md:px-8 py-3.5 md:py-3.5 rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                <Info className="w-5 h-5 md:w-6 md:h-6" /> More Info
              </Link>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-16 md:bottom-32 left-0 right-0 z-30 flex justify-center gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-[#e50914]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {isPlaying && (
        <VideoPlayer 
          movieTitle={movie.title || (movie as any).name} 
          videoId={`tmdb-${movie.id}`} 
          type={(!movie.title && (movie as any).name) ? "tv" : "movie"}
          onClose={() => setIsPlaying(false)} 
        />
      )}
    </>
  );
}
