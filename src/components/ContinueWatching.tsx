"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { getImageUrl } from "@/lib/tmdb";

interface ContinueItem {
  id: string;
  title: string;
  posterPath: string;
  progress: number; // percentage
  timestamp: number;
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("netfast_progress_")) {
        const id = key.replace("netfast_progress_", "");
        const info = localStorage.getItem(`netfast_info_${id}`);
        if (info) {
          const parsed = JSON.parse(info);
          const progress = parseFloat(localStorage.getItem(key) || "0");
          const duration = parseFloat(localStorage.getItem(`netfast_duration_${id}`) || "7200");
          
          saved.push({
            id,
            title: parsed.title,
            posterPath: parsed.posterPath,
            progress: (progress / duration) * 100,
            timestamp: parseInt(localStorage.getItem(`netfast_time_${id}`) || "0")
          });
        }
      }
    }
    setItems(saved.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-6">
      <h2 className="text-2xl font-bold text-white mb-6">Continue Watching</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="group relative glass rounded-xl overflow-hidden aspect-video"
          >
            <Link href={`/movie/${item.id.replace('tmdb-', '')}`} className="block w-full h-full relative">
              <SafeImage 
                src={item.posterPath} 
                alt={item.title} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#e50914] flex items-center justify-center shadow-lg">
                  <Play className="fill-white text-white w-6 h-6 ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold truncate mb-2">{item.title}</h3>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#e50914]" 
                    style={{ width: `${Math.min(item.progress, 100)}%` }} 
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
