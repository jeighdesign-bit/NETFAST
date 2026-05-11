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
    <div className="relative min-h-[100vh] md:min-h-[85vh] md:h-[85vh] w-full overflow-hidden flex items-center justify-center">
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
      <div className="absolute inset-0 z-20 flex items-start md:items-center pt-32 md:pt-0">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl pt-20 md:pt-0"
          >
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-[1.1]" style={{ fontFamily: "var(--font-outfit)" }}>
              {movie.title || (movie as any).name}
            </h1>
            
            <div className="flex items-center gap-3 md:gap-4 mb-6 text-[10px] md:text-sm font-bold">
              <span className="text-green-400">{Math.round(movie.vote_average * 10)}% Match</span>
              <span className="text-gray-400">{movie.release_date?.substring(0,4)}</span>
              <span className="border border-white/40 px-2 py-0.5 rounded-[4px] text-[8px] md:text-[10px] text-white">4K ULTRA HD</span>
            </div>

            <p className="text-base md:text-lg text-gray-300 mb-8 line-clamp-3 md:line-clamp-none">
              {movie.overview}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center justify-center gap-2 bg-white text-black hover:bg-[#e50914] hover:text-white px-8 py-4 md:py-3 rounded-xl md:rounded-md font-bold text-base md:text-lg transition-all shadow-xl"
              >
                <Play className="fill-current w-5 h-5" /> 
                {isTV ? `Play S${selectedSeason}:E${selectedEpisode}` : 'Watch Now'}
              </button>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
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
            </div>

            {/* Browser Recommendation Alert */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-3 p-3 px-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md max-w-xl group hover:border-yellow-500/40 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500/80 shrink-0" />
              <p className="text-gray-400 text-[10px] md:text-xs font-medium tracking-wide leading-tight">
                Ad-Free: Use <span className="font-bold text-white/90">uBlock Origin</span> (PC) or <span className="font-bold text-white/90">Brave Browser</span> (Mobile)
              </p>
            </motion.div>

            {/* TV Show Episode Selector */}
            {isTV && tvData && (
              <div className="mt-8 md:mt-12 p-5 md:p-6 glass rounded-[2rem] border border-white/10 max-w-2xl bg-black/40 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <button 
                        onClick={() => setShowSeasonSelector(!showSeasonSelector)}
                        className="flex items-center gap-3 text-white font-black bg-[#e50914] px-5 py-3 rounded-xl hover:bg-[#ff1e2a] transition-all shadow-[0_10px_20px_rgba(229,9,20,0.3)] text-xs uppercase tracking-widest"
                      >
                        Season {selectedSeason} <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      <AnimatePresence>
                        {showSeasonSelector && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-0 mb-4 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden z-[100] min-w-[160px] shadow-2xl backdrop-blur-2xl"
                          >
                            {tvData.seasons.map(s => (
                              <button 
                                key={s.id}
                                onClick={() => { setSelectedSeason(s.season_number); setSelectedEpisode(1); setShowSeasonSelector(false); }}
                                className={`w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedSeason === s.season_number ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                              >
                                Season {s.season_number}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-white font-black text-lg md:text-xl tracking-tighter uppercase">{currentSeason.episode_count} Episodes</span>
                    <span className="text-gray-500 text-[9px] uppercase font-bold tracking-[0.2em] mt-0.5">Ultra HD Streaming</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-3 max-h-[180px] md:max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {Array.from({ length: currentSeason.episode_count }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedEpisode(i + 1)}
                      className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all group ${selectedEpisode === i + 1 ? 'bg-[#e50914] border-[#e50914] text-white shadow-[0_10px_20px_rgba(229,9,20,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/40 hover:bg-white/10'}`}
                    >
                      <span className="text-base md:text-lg font-black">{i + 1}</span>
                      {selectedEpisode === i + 1 && (
                        <motion.div layoutId="activeEpisode" className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-lg" />
                      )}
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
