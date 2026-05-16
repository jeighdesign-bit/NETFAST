"use client";

import { motion } from "framer-motion";
import { Play, Plus, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useBackground } from "@/context/BackgroundContext";
import MovieCard from "./MovieCard";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), { ssr: false });

interface MovieRowProps {
  title: string;
  category: string;
  highlight?: boolean;
  movies: Movie[];
  variant?: "standard" | "ranked";
  hideSeeAll?: boolean;
}

export default function MovieRow({ title, category, highlight, movies, variant = "standard", hideSeeAll = false }: MovieRowProps) {
  const { setBackdrop } = useBackground();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  
  const handleSetBackdrop = useCallback((url: string | null) => {
    setBackdrop(url);
  }, [setBackdrop]);

  const handlePlay = useCallback((movie: Movie) => {
    setActiveMovie(movie);
  }, []);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full relative py-4 md:py-12">
      <div className="container mx-auto px-6 flex items-center justify-between mb-4 md:mb-8 relative z-20">
        <h2 className={`text-xl md:text-3xl font-black uppercase tracking-tighter ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#8b5cf6]' : 'text-white'}`} style={{ fontFamily: "var(--font-outfit)" }}>
          {title}
        </h2>
        {!hideSeeAll && (
          <Link 
            href={category} 
            prefetch={true}
            className="relative z-30 group inline-flex items-center gap-1.5 md:gap-2 text-gray-400 hover:text-white transition-all duration-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] py-2 md:py-2.5 px-4 md:px-5 rounded-full bg-[#111]/80 backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95 cursor-pointer pointer-events-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">See All</span>
            <ChevronRight className="relative z-10 w-3 h-3 md:w-4 md:h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </Link>
        )}
      </div>
      
      <div className="flex gap-3 md:gap-6 overflow-x-auto hide-scrollbar pb-6 md:pb-10 pt-2 px-6 snap-x snap-mandatory scroll-smooth">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            variant={variant} 
            index={index} 
            onPlay={handlePlay}
            onSetBackdrop={handleSetBackdrop}
          />
        ))}
      </div>

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
