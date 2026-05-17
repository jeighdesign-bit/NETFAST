"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), { ssr: false });
import { Movie, getImageUrl } from "@/lib/tmdb";

export default function HeroBanner({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentIndex((p) => (p + 1) % movies.length); // swipe left = next
      else setCurrentIndex((p) => (p - 1 + movies.length) % movies.length); // swipe right = prev
    }
  };

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
      <div
        className="relative w-full h-[70vh] md:h-[90vh] flex items-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
            {/* Mobile: use w780 to reduce bandwidth; desktop: original quality */}
            <SafeImage
              src={getImageUrl(movie.backdrop_path, "original")}
              fallbackSrc={getImageUrl(movie.poster_path, "original")}
              alt={movie.title || (movie as any).name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              quality={75}
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

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentIndex((p) => (p - 1 + movies.length) % movies.length)}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((p) => (p + 1) % movies.length)}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 md:bottom-16 left-0 right-0 z-30 flex justify-center gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-[#e50914]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {isPlaying && (
        <VideoPlayer 
          movieTitle={movie.title || (movie as any).name} 
          videoId={`tmdb-${movie.id}`} 
          type={(!movie.title && (movie as any).name) ? "tv" : "movie"}
          posterPath={getImageUrl(movie.poster_path, "w500")}
          backdropPath={getImageUrl(movie.backdrop_path, "original")}
          onClose={() => setIsPlaying(false)} 
        />
      )}
    </>
  );
}
