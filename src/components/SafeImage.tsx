"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: ImageProps["src"] | null | undefined;
  fallbackSrc?: string | null;
  /** Shown in the placeholder when no image is available */
  alt: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Detect if 'fill' prop is used to apply correct positioning to placeholder
  const isFill = "fill" in props && !!props.fill;

  // Treat the Unsplash clapperboard as "no real image" — show placeholder instead
  const CLAPPERBOARD =
    "https://images.unsplash.com/photo-1485846234645-a62644f84728";
  
  const isInvalid = (path: any) => {
    if (!path) return true;
    if (typeof path !== "string") return false;
    return (
      path === "" || 
      path.includes(CLAPPERBOARD) || 
      path.endsWith("null") || 
      path.endsWith("undefined") ||
      path.includes("/w500/.jpg") ||
      path.includes("/original/.jpg")
    );
  };

  const mainInvalid = isInvalid(src);
  const fallbackInvalid = isInvalid(fallbackSrc);

  const handleError = () => {
    if (!useFallback && !fallbackInvalid) {
      setUseFallback(true);
    } else {
      setError(true);
    }
  };

  if (error || (mainInvalid && (fallbackInvalid || useFallback))) {
    const initial = (alt || "?").charAt(0).toUpperCase();
    return (
      <div
        className={`${isFill ? "absolute inset-0" : "w-full h-full"} flex flex-col items-center justify-center bg-gradient-to-br from-[#121212] via-[#1a1a2e] to-[#0f0f0f] select-none border border-white/5`}
        aria-label={alt}
      >
        <div className="relative flex flex-col items-center">
          <Film className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
          <span className="text-6xl font-black text-white/20 tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
            {initial}
          </span>
          <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-4 px-6 text-center line-clamp-2 font-bold max-w-[200px]">
            {alt}
          </span>
        </div>
        {/* Subtle noise/texture overlay for premium look */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
    );
  }

  const currentSrc = (mainInvalid || useFallback) ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={currentSrc as any}
      alt={alt}
      onError={handleError}
      // Add a tiny random param to bust potential bad edge caches if it's a TMDB URL
      {...(typeof currentSrc === 'string' && currentSrc.includes('tmdb.org') ? { unoptimized: true } : {})}
    />
  );
}
