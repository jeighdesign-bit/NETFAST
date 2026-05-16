"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
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

  // Treat the Unsplash clapperboard as "no real image" — show placeholder instead
  const CLAPPERBOARD =
    "https://images.unsplash.com/photo-1485846234645-a62644f84728";
  const hasRealSrc =
    src &&
    typeof src === "string" &&
    src !== "" &&
    !src.includes(CLAPPERBOARD);

  if (error || !hasRealSrc) {
    // Styled gradient placeholder — unique per title initial
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

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
