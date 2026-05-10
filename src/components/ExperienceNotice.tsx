"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceNotice() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 mb-12"
    >
      <div className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-center gap-4 text-center group hover:border-yellow-500/40 transition-all duration-500 shadow-[0_10px_40px_rgba(234,179,8,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-gray-300 text-xs md:text-sm font-black uppercase tracking-[0.15em] leading-relaxed">
            For best experience, use{" "}
            <a 
              href="https://ublockorigin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white underline decoration-yellow-500/50 hover:decoration-yellow-500 transition-all underline-offset-4 decoration-2"
            >
              uBlock Origin
            </a>
            {" "}or{" "}
            <a 
              href="https://brave.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white underline decoration-yellow-500/50 hover:decoration-yellow-500 transition-all underline-offset-4 decoration-2"
            >
              Brave Browser
            </a>
          </p>
        </div>
        <div className="hidden md:block w-px h-6 bg-yellow-500/20 mx-2" />
        <p className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-[0.3em]">
          Blocks Ads • High Speed Stream
        </p>
      </div>
    </motion.div>
  );
}
