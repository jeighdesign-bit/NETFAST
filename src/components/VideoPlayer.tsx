"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, RefreshCw, AlertCircle, History, Smartphone, Maximize, Minimize
} from "lucide-react";

interface VideoPlayerProps {
  movieTitle: string;
  onClose: () => void;
  videoId: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  posterPath?: string | null;
}

type Provider = "codespecter" | "vidsrc_xyz" | "vidsrc_to" | "embed_su" | "smashystream" | "vidlink" | "vidsrc_me" | "superflix";

export default function VideoPlayer({ 
  movieTitle, 
  onClose, 
  videoId, 
  type = "movie", 
  season = 1, 
  episode = 1,
  posterPath 
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const [provider, setProvider] = useState<Provider>("codespecter");
  const [progress, setProgress] = useState(0);
  const [initialProgress, setInitialProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const tmdbId = videoId.replace('tmdb-', '');
  
  // Load initial progress once
  useEffect(() => {
    const savedProgress = localStorage.getItem(`netfast_progress_${videoId}`);
    if (savedProgress) {
      const p = parseFloat(savedProgress);
      setInitialProgress(p);
      setProgress(p);
    }
  }, [videoId]);

  // Optimized progress tracking - run every 10 seconds instead of 5 to save resources
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const currentProgress = initialProgress + elapsedSeconds;
      
      // Batch localStorage updates
      const progressData = {
        progress: currentProgress.toString(),
        time: Date.now().toString(),
        info: JSON.stringify({
          title: movieTitle,
          posterPath: posterPath || `https://image.tmdb.org/t/p/w500/${tmdbId}`,
          type,
          season,
          episode
        }),
        duration: "7200"
      };

      localStorage.setItem(`netfast_progress_${videoId}`, progressData.progress);
      localStorage.setItem(`netfast_time_${videoId}`, progressData.time);
      localStorage.setItem(`netfast_info_${videoId}`, progressData.info);
      localStorage.setItem(`netfast_duration_${videoId}`, progressData.duration);
      
      setProgress(currentProgress);
    }, 10000); // 10 seconds is enough for progress tracking

    return () => clearInterval(interval);
  }, [videoId, movieTitle, tmdbId, posterPath, type, season, episode, initialProgress]);

  const getEmbedUrl = (p: Provider) => {
    const isTV = type === "tv";
    // USE initialProgress here so it doesn't change every 5 seconds
    const timeValue = initialProgress > 10 ? Math.floor(initialProgress) : null;
    
    switch(p) {
      case "codespecter":
        return isTV 
          ? `https://api.codespecters.com/embed/tv/${tmdbId}/${season}/${episode}?apikey=${process.env.NEXT_PUBLIC_EMBED_API_KEY}&autoplay=1${timeValue ? `&t=${timeValue}` : ''}`
          : `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${process.env.NEXT_PUBLIC_EMBED_API_KEY}&autoplay=1${timeValue ? `&t=${timeValue}` : ''}`;
      case "vidsrc_xyz":
        return isTV
          ? `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&autoplay=1${timeValue ? `&t=${timeValue}` : ''}`
          : `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}&autoplay=1${timeValue ? `&t=${timeValue}` : ''}`;
      case "vidsrc_to":
        return isTV
          ? `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1${timeValue ? `&t=${timeValue}` : ''}`
          : `https://vidsrc.to/embed/movie/${tmdbId}?autoplay=1${timeValue ? `&t=${timeValue}` : ''}`;
      case "embed_su":
        return isTV
          ? `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1${timeValue ? `&t=${timeValue}` : ''}`
          : `https://embed.su/embed/movie/${tmdbId}?autoplay=1${timeValue ? `&t=${timeValue}` : ''}`;
      case "smashystream":
        return isTV
          ? `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}&autoplay=1`
          : `https://player.smashy.stream/movie/${tmdbId}?autoplay=1`;
      case "vidlink":
        return isTV
          ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?autoplay=1`
          : `https://vidlink.pro/movie/${tmdbId}?autoplay=1`;
      case "vidsrc_me":
        return isTV
          ? `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&autoplay=1`
          : `https://vidsrc.me/embed/movie?tmdb=${tmdbId}&autoplay=1`;
      case "superflix":
        return isTV
          ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}&autoplay=1`
          : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&autoplay=1`;
      default:
        return "";
    }
  };

  const embedUrl = getEmbedUrl(provider);

  const handleProviderChange = (newProvider: Provider) => {
    if (newProvider === provider) return;
    // Update initialProgress to current progress before switching provider
    setInitialProgress(progress);
    setProvider(newProvider);
    setIsLoading(true);
    setError(false);
    setKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setInitialProgress(progress);
    setKey(prev => prev + 1);
    setIsLoading(true);
    setError(false);
  };

  // Fullscreen toggle — handles both browser fullscreen and orientation
  const toggleFullscreen = useCallback(async () => {
    if (!playerContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (playerContainerRef.current.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        } else if ((playerContainerRef.current as any).webkitRequestFullscreen) {
          await (playerContainerRef.current as any).webkitRequestFullscreen();
        } else if ((playerContainerRef.current as any).msRequestFullscreen) {
          await (playerContainerRef.current as any).msRequestFullscreen();
        }

        // Try to lock orientation if supported
        const screenOrientation = screen?.orientation as any;
        if (screenOrientation?.lock) {
          await screenOrientation.lock('landscape').catch(() => {});
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        
        const screenOrientation = screen?.orientation as any;
        if (screenOrientation?.unlock) {
          screenOrientation.unlock();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  // Sync fullscreen state with browser events (e.g. ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Unlock orientation when player closes
  useEffect(() => {
    return () => {
      try {
        const screenOrientation = screen?.orientation as any;
        screenOrientation?.unlock?.();
      } catch {}
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
      >
        {/* Source Selector Bar - scrollable on mobile */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-1.5 mb-3 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md w-full max-w-4xl overflow-x-auto hide-scrollbar"
        >
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-gray-500 px-2 font-bold shrink-0">Server:</span>
          {(["codespecter", "vidsrc_xyz", "vidsrc_to", "embed_su", "smashystream", "vidlink", "vidsrc_me", "superflix"] as Provider[]).map((p) => (
            <button
              key={p}
              onClick={() => handleProviderChange(p)}
              className={`shrink-0 px-3 py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-tight transition-all min-h-[40px] ${
                provider === p 
                  ? "bg-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20"
              }`}
            >
              {p === "codespecter" ? "⭐ Premium" : p === "vidsrc_xyz" ? "VidSrc" : p === "vidsrc_to" ? "VidSrc.to" : p === "embed_su" ? "Embed.su" : p === "smashystream" ? "Smashy" : p === "vidlink" ? "VidLink" : p === "vidsrc_me" ? "VidSrc.me" : "SuperFlix"}
            </button>
          ))}
        </motion.div>
        
        {/* Tip — hidden on small phones to save space */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex mb-3 w-full max-w-4xl p-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md items-center justify-center gap-2"
        >
          <p className="text-gray-400 text-[10px] font-medium tracking-wide">
            Zero Ads: Use <span className="font-bold text-white">uBlock Origin</span> (PC) or <span className="font-bold text-white">Brave Browser</span> (Mobile)
          </p>
        </motion.div>

        <div 
          ref={playerContainerRef}
          className={`relative w-full transition-all duration-500 bg-black overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] group ${
            isFullscreen 
              ? 'fixed inset-0 z-[200] h-screen w-screen' 
              : 'max-w-4xl aspect-video rounded-2xl md:rounded-3xl border border-white/10'
          }`}
        >
          
          {/* Controls overlay — pointer-events-none so taps pass through to iframe video controls */}
          <div className="absolute top-0 left-0 right-0 z-50 p-3 md:p-6 h-fit flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
              <button 
                onClick={onClose} 
                className="text-white hover:bg-[#e50914] p-2 md:p-3 rounded-xl transition-all bg-black/60 border border-white/10 backdrop-blur-md active:scale-90"
              >
                <ArrowLeft className="w-5 h-5 md:w-7 md:h-7" />
              </button>
              <div>
                <h2 className="text-sm md:text-2xl font-black text-white tracking-tight leading-none line-clamp-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {movieTitle}
                </h2>
                {type === "tv" && (
                  <p className="text-[#e50914] font-bold text-[9px] md:text-sm mt-0.5 uppercase tracking-widest">S{season} • E{episode}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Reliable Custom Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className={`flex items-center justify-center px-4 py-2 h-10 rounded-xl transition-all border backdrop-blur-md active:scale-90 pointer-events-auto ${
                  isFullscreen
                    ? "bg-[#e50914] border-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                    : "bg-black/80 border-white/20 text-white hover:bg-white/20"
                }`}
                title="Use this if the video's fullscreen button fails"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest mr-2 hidden sm:inline">
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </span>
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>

              {progress > 60 && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <History className="w-3 h-3 text-[#e50914]" />
                  <span>Resuming: {Math.floor(progress / 60)}m</span>
                </div>
              )}
              <button 
                onClick={handleRefresh} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/60 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md text-white/40 hover:text-white active:scale-90"
              >
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          <div className="w-full h-full relative bg-black">
            <iframe
              key={key}
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              // @ts-ignore
              webkitallowfullscreen="true"
              // @ts-ignore
              mozallowfullscreen="true"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
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
        </div>

        {/* Backdrop background */}
        <div className="absolute inset-0 -z-10" />
      </motion.div>
    </AnimatePresence>
  );
}


