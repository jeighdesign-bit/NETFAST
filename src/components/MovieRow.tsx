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
    <div className="w-full relative py-4">
      <div className="container mx-auto px-6 flex items-center justify-between mb-4">
        <h2 className={`text-xl md:text-2xl font-bold ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#8b5cf6]' : 'text-white'}`}>
          {title}
        </h2>
        <Link 
          href={category} 
          className="group flex items-center gap-1 text-gray-400 hover:text-white transition-all text-xs md:text-sm font-medium py-1 px-2 rounded-md hover:bg-white/5"
        >
          <span>Explore All</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-6 pt-2 px-6">
        {movies.map((movie, index) => {
          const isTV = !movie.title && (movie as any).name;
          const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
          
          return (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              onMouseEnter={() => setBackdrop(getImageUrl(movie.backdrop_path, 'original'))}
              onMouseLeave={() => setBackdrop(null)}
              className={`relative ${variant === 'ranked' ? 'min-w-[220px] md:min-w-[280px] ml-10 md:ml-12' : 'min-w-[150px] md:min-w-[240px]'} h-[225px] md:h-[360px] rounded-xl overflow-hidden cursor-pointer group bg-[#111] shrink-0`}
              onClick={() => router.push(href)}
            >
              {variant === 'ranked' && (
                <div className="absolute -left-10 md:-left-12 bottom-0 z-0 select-none pointer-events-none">
                  <span className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent stroke-white/20" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)", fontFamily: "var(--font-outfit)" }}>
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
