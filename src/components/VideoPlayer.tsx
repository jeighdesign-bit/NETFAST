"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, RefreshCw, AlertCircle
} from "lucide-react";

interface VideoPlayerProps {
  movieTitle: string;
  onClose: () => void;
  videoId: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
}

type Provider = "codespecter" | "vidsrc_xyz" | "vidsrc_to" | "embed_su";

export default function VideoPlayer({ movieTitle, onClose, videoId, type = "movie", season = 1, episode = 1 }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const [provider, setProvider] = useState<Provider>("vidsrc_xyz");

  const tmdbId = videoId.replace('tmdb-', '');
  
  const getEmbedUrl = (p: Provider) => {
    const isTV = type === "tv";
    switch(p) {
      case "vidsrc_xyz":
        return isTV
          ? `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
          : `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`;
      case "vidsrc_to":
        return isTV
          ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://vidsrc.to/embed/movie/${tmdbId}`;
      case "embed_su":
        return isTV
          ? `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
          : `https://embed.su/embed/movie/${tmdbId}`;
      default:
        return "";
    }
  };

  const embedUrl = getEmbedUrl(provider);

  useEffect(() => {
    localStorage.setItem(`netfast_info_${videoId}`, JSON.stringify({
      title: movieTitle,
      posterPath: `https://image.tmdb.org/t/p/w500/${tmdbId}`
    }));
    localStorage.setItem(`netfast_time_${videoId}`, Date.now().toString());
    localStorage.setItem(`netfast_duration_${videoId}`, "7200"); 
  }, [videoId, movieTitle, tmdbId]);

  const handleProviderChange = (newProvider: Provider) => {
    if (newProvider === provider) return;
    setProvider(newProvider);
    setIsLoading(true);
    setError(false);
    setKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    setIsLoading(true);
    setError(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
      >
        {/* Source Selector Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-4 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
        >
          <span className="text-[10px] uppercase tracking-widest text-gray-500 px-3 font-bold">Servers:</span>
          {(["vidsrc_xyz", "vidsrc_to", "embed_su"] as Provider[]).map((p) => (
            <button
              key={p}
              onClick={() => handleProviderChange(p)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                provider === p 
                  ? "bg-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {p.replace('_', ' ')}
            </button>
          ))}
        </motion.div>

        <div className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] border border-white/10 group">
          
          {/* Internal Top Bar - Hidden on idle, shows on hover */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-8 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex items-center gap-6 pointer-events-auto">
              <button 
                onClick={onClose} 
                className="text-white hover:bg-[#e50914] p-3 rounded-2xl transition-all bg-black/60 border border-white/10 backdrop-blur-md"
              >
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <div>
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {movieTitle}
                </h2>
                {type === "tv" && (
                  <p className="text-[#e50914] font-bold text-xs md:text-sm mt-2 uppercase tracking-widest">Season {season} • Episode {episode}</p>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleRefresh} 
              className="pointer-events-auto text-white/40 hover:text-white p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-full relative bg-black">
            <iframe
              key={key}
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={() => setIsLoading(false)}
              onError={() => setError(true)}
            />
            
            {/* Loading Overlay */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-[6px] border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-[6px] border-t-[#e50914] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <div className="absolute inset-6 border-2 border-white/10 rounded-full animate-pulse" />
                  </div>
                  <p className="text-white font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mb-3">Initializing Secure Stream</p>
                  <p className="text-gray-500 text-[8px] md:text-[10px] uppercase tracking-tighter max-w-[200px] mx-auto opacity-60">Please wait while we establish a high-quality cinematic connection...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-20 px-6 text-center">
                <div className="max-w-md">
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Connection Lost</h3>
                  <p className="text-gray-400 mb-10 text-sm md:text-base leading-relaxed">The secure gateway encountered an unexpected interruption. This could be due to provider maintenance or network issues.</p>
                  <button 
                    onClick={handleRefresh}
                    className="bg-[#e50914] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#ff1e2a] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(229,9,20,0.3)]"
                  >
                    Reconnect Stream
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close interaction for mobile */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
            <div className="px-6 py-3 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] shadow-2xl">
              Tap for Player Controls
            </div>
          </div>
        </div>

        {/* Backdrop click to close */}
        <div className="absolute inset-0 -z-10 cursor-pointer" onClick={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}
