"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Volume2, VolumeX, X, ChevronDown, AlertTriangle } from "lucide-react";
import SafeImage from "./SafeImage";
import { Movie, TVDetail, getImageUrl } from "@/lib/tmdb";
import VideoPlayer from "./VideoPlayer";

interface MovieInteractiveAreaProps {
  movie: Movie;
  isTV?: boolean;
  tvData?: TVDetail;
}

export default function MovieInteractiveArea({ movie, isTV = false, tvData }: MovieInteractiveAreaProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);

  // Auto-scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie.id]);

  const currentSeason = tvData?.seasons?.find(s => s.season_number === selectedSeason) || { episode_count: 12 };

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Cinematic */}
      <div className="absolute inset-0 z-0">
        <SafeImage 
          src={getImageUrl(movie.backdrop_path, "original")} 
          alt={movie.title || (movie as any).name} 
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              {movie.title || (movie as any).name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 text-sm font-bold">
              <span className="text-green-400">{Math.round(movie.vote_average * 10)}% Match</span>
              <span className="text-gray-400">{movie.release_date?.substring(0,4)}</span>
              <span className="border border-white/40 px-2 rounded text-[10px] text-white">4K ULTRA HD</span>
            </div>

            <p className="text-lg text-gray-300 mb-8 line-clamp-3 md:line-clamp-none">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-2 bg-white text-black hover:bg-[#e50914] hover:text-white px-8 py-3 rounded-md font-bold text-lg transition-all"
              >
                <Play className="fill-current w-5 h-5" /> 
                {isTV ? `Play S${selectedSeason}:E${selectedEpisode}` : 'Watch Now'}
              </button>
              
              <button className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 hover:border-white transition-colors bg-black/20">
                <Plus className="text-white w-6 h-6" />
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-white/20 hover:border-white transition-colors bg-black/20"
              >
                {isMuted ? <VolumeX className="text-white w-5 h-5" /> : <Volume2 className="text-white w-5 h-5" />}
              </button>
            </div>

            {/* Browser Recommendation Alert */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-3 p-3 px-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md max-w-xl group hover:border-yellow-500/40 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500/80 shrink-0 group-hover:scale-110 transition-transform" />
              <p className="text-gray-400 text-[11px] md:text-xs font-medium tracking-wide">
                For best experience, use <span className="font-bold text-white/90">uBlock Origin</span> or <span className="font-bold text-white/90">Brave Browser</span>
              </p>
            </motion.div>

            {/* TV Show Episode Selector */}
            {isTV && tvData && (
              <div className="mt-8 p-4 glass rounded-xl border border-white/10 max-w-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowSeasonSelector(!showSeasonSelector)}
                      className="flex items-center gap-2 text-white font-bold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Season {selectedSeason} <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showSeasonSelector && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 mb-2 bg-[#111] border border-white/10 rounded-lg overflow-hidden z-50 min-w-[120px]"
                        >
                          {tvData.seasons.map(s => (
                            <button 
                              key={s.id}
                              onClick={() => { setSelectedSeason(s.season_number); setSelectedEpisode(1); setShowSeasonSelector(false); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#e50914] hover:text-white transition-colors"
                            >
                              Season {s.season_number}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-gray-500 text-xs uppercase tracking-widest">{currentSeason.episode_count} Episodes</span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {Array.from({ length: currentSeason.episode_count }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedEpisode(i + 1)}
                      className={`flex-shrink-0 w-10 h-10 rounded-md border flex items-center justify-center font-bold transition-all ${selectedEpisode === i + 1 ? 'bg-[#e50914] border-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/40'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {isPlaying && (
        <VideoPlayer 
          movieTitle={tvData ? tvData.name : (movie as any).title} 
          videoId={`tmdb-${movie.id}`} 
          type={isTV ? "tv" : "movie"}
          season={selectedSeason}
          episode={selectedEpisode}
          onClose={() => setIsPlaying(false)} 
        />
      )}
    </div>
  );
}
