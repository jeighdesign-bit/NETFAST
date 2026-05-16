"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Plus, Info } from "lucide-react";
import { Movie, getImageUrl } from "@/lib/tmdb";
import SafeImage from "./SafeImage";
import { useRouter } from "next/navigation";

interface MovieCardProps {
  movie: Movie;
  variant: "standard" | "ranked";
  index: number;
  onPlay: (movie: Movie) => void;
  onSetBackdrop: (url: string | null) => void;
}

const MovieCard = React.memo(({ movie, variant, index, onPlay, onSetBackdrop }: MovieCardProps) => {
  const router = useRouter();
  const isTV = !movie.title && (movie as any).name;
  const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  const handleMylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentList = JSON.parse(localStorage.getItem("netfast_mylist") || "[]");
    const exists = currentList.find((m: Movie) => m.id === movie.id);
    if (exists) {
      const newList = currentList.filter((m: Movie) => m.id !== movie.id);
      localStorage.setItem("netfast_mylist", JSON.stringify(newList));
    } else {
      currentList.push(movie);
      localStorage.setItem("netfast_mylist", JSON.stringify(currentList));
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onMouseEnter={() => onSetBackdrop(getImageUrl(movie.backdrop_path, 'original'))}
      onMouseLeave={() => onSetBackdrop(null)}
      className={`relative ${variant === 'ranked' ? 'min-w-[200px] md:min-w-[320px] ml-10 md:ml-16' : 'min-w-[160px] md:min-w-[260px]'} h-[240px] md:h-[390px] rounded-2xl overflow-hidden cursor-pointer group bg-[#111] shrink-0 shadow-2xl border border-white/5 snap-start active:scale-95 transition-transform duration-200 gpu`}
      onClick={() => router.push(href)}
    >
      {variant === 'ranked' && (
        <div className="absolute -left-12 md:-left-16 bottom-0 z-0 select-none pointer-events-none">
          <span className="text-[140px] md:text-[220px] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", fontFamily: "var(--font-outfit)" }}>
            {index + 1}
          </span>
        </div>
      )}
      <div className="relative w-full h-full z-10">
        <SafeImage 
          src={getImageUrl(movie.poster_path)} 
          fallbackSrc={getImageUrl(movie.backdrop_path)}
          alt={movie.title || (movie as any).name} 
          fill
          sizes="(max-width: 768px) 150px, 240px"
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
          quality={75} // Reduced quality for faster thumbnail loading
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Desktop Hover UI */}
        <div className="hidden md:flex absolute inset-0 p-4 flex-col justify-end translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onPlay(movie);
              }}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#e50914] hover:text-white transition-colors"
            >
              <Play className="fill-current w-5 h-5 ml-1" />
            </button>
            <button 
              onClick={handleMylist}
              className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); router.push(href); }}
              className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:border-white transition-colors ml-auto"
            >
              <Info className="w-5 h-5 text-white" />
            </button>
          </div>
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{movie.title || (movie as any).name}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
            <span className="border border-white/20 px-1 rounded text-gray-300">HD</span>
            <span className="text-gray-300">{movie.release_date?.substring(0,4)}</span>
          </div>
        </div>

        {/* Mobile Info Overlay */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h3 className="font-bold text-sm text-white line-clamp-1 leading-tight">{movie.title || (movie as any).name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-green-400">{Math.round(movie.vote_average * 10)}%</span>
            <span className="text-[9px] text-gray-400">{movie.release_date?.substring(0,4)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
