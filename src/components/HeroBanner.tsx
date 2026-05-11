"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import VideoPlayer from "./VideoPlayer";
import { Movie, getImageUrl } from "@/lib/tmdb";

export default function HeroBanner({ movie }: { movie: Movie }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!movie) return null;

  const isTV = !movie.title && (movie as any).name;
  const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <>
      <div className="relative w-full h-[85vh] flex items-center">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <SafeImage
            src={getImageUrl(movie.backdrop_path, "original")}
            alt={movie.title || (movie as any).name}
            fill
            priority
            quality={90}
            className="object-cover opacity-60"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl pt-20 md:pt-0"
          >
            <div className="inline-block px-3 py-1 mb-4 rounded-full glass border border-[#e50914]/50 text-[#ff4b4b] text-[10px] md:text-xs font-bold tracking-widest uppercase">
              #1 Trending Worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 text-white drop-shadow-2xl leading-[1.1] uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              {movie.title || (movie as any).name}
            </h1>
            <p className="text-sm md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed line-clamp-3 md:line-clamp-none">
              {movie.overview}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center justify-center gap-2 bg-[#e50914] hover:bg-[#ff4b4b] text-white px-8 py-4 md:py-3 rounded-xl md:rounded-md font-bold text-base md:text-lg transition-all duration-300 shadow-[0_10px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_15px_30px_rgba(229,9,20,0.5)]"
              >
                <Play className="fill-current w-5 h-5" /> Watch Now
              </button>
              <Link 
                href={href}
                className="flex items-center justify-center gap-2 glass border border-white/10 hover:bg-white/20 text-white px-8 py-4 md:py-3 rounded-xl md:rounded-md font-bold text-base md:text-lg transition-all duration-300"
              >
                <Info className="w-5 h-5" /> More Info
              </Link>
            </div>

          </motion.div>
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
