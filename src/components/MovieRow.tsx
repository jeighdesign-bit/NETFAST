"use client";

import { motion } from "framer-motion";
import { Play, Plus, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { Movie, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useBackground } from "@/context/BackgroundContext";

interface MovieRowProps {
  title: string;
  category: string;
  highlight?: boolean;
  movies: Movie[];
  variant?: "standard" | "ranked";
}

export default function MovieRow({ title, category, highlight, movies, variant = "standard" }: MovieRowProps) {
  const router = useRouter();
  const { setBackdrop } = useBackground();
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full relative py-4 md:py-12">
      <div className="container mx-auto px-6 flex items-center justify-between mb-4 md:mb-8">
        <h2 className={`text-xl md:text-3xl font-black uppercase tracking-tighter ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#8b5cf6]' : 'text-white'}`} style={{ fontFamily: "var(--font-outfit)" }}>
          {title}
        </h2>
        <Link 
          href={category} 
          className="group flex items-center gap-1 text-gray-400 hover:text-white transition-all text-[9px] md:text-sm font-bold uppercase tracking-widest py-1 px-3 rounded-full bg-white/5 border border-white/5"
        >
          <span>See All</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="flex gap-3 md:gap-6 overflow-x-auto hide-scrollbar pb-6 md:pb-10 pt-2 px-6 snap-x snap-mandatory scroll-smooth">
        {movies.map((movie, index) => {
          const isTV = !movie.title && (movie as any).name;
          const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
          
          return (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onMouseEnter={() => setBackdrop(getImageUrl(movie.backdrop_path, 'original'))}
              onMouseLeave={() => setBackdrop(null)}
              className={`relative ${variant === 'ranked' ? 'min-w-[240px] md:min-w-[320px] ml-12 md:ml-16' : 'min-w-[140px] md:min-w-[260px]'} h-[210px] md:h-[390px] rounded-2xl overflow-hidden cursor-pointer group bg-[#111] shrink-0 shadow-2xl border border-white/5 snap-start md:snap-none active:scale-95 transition-transform duration-300`}
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
                  alt={movie.title || (movie as any).name} 
                  fill
                  sizes="(max-width: 768px) 150px, 240px"
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Desktop Hover UI - Hidden on small mobile to avoid confusion */}
                <div className="hidden md:flex absolute inset-0 p-4 flex-col justify-end translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveMovie(movie);
                      }}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#e50914] hover:text-white transition-colors"
                    >
                      <Play className="fill-current w-5 h-5 ml-1" />
                    </button>
                    <button 
                      onClick={(e) => { 
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
                      }}
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

                {/* Mobile Info Overlay (Visible always or simplified) */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                   <h3 className="font-bold text-xs text-white line-clamp-1">{movie.title || (movie as any).name}</h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeMovie && (
        <VideoPlayer 
          movieTitle={activeMovie.title || (activeMovie as any).name} 
          videoId={`tmdb-${activeMovie.id}`} 
          type={(!activeMovie.title && (activeMovie as any).name) ? "tv" : "movie"}
          onClose={() => setActiveMovie(null)} 
        />
      )}
    </div>
  );
}
