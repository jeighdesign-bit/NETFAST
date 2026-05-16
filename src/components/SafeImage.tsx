"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: ImageProps["src"] | null | undefined;
  fallbackSrc?: string;
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
      path.includes("/w500/.jpg") // Common broken TMDB path
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
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] select-none"
        aria-label={alt}
      >
        <Film className="w-8 h-8 text-white/20 mb-2" />
        <span className="text-4xl font-black text-white/30" style={{ fontFamily: "var(--font-outfit)" }}>
          {initial}
        </span>
        <span className="text-[9px] text-white/20 uppercase tracking-widest mt-2 px-3 text-center line-clamp-2 font-bold">
          {alt}
        </span>
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
    />
  );
}
