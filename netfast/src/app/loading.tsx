"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-4 border-[#e50914] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-[#8b5cf6] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
        </div>
        <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#8b5cf6] neon-text" style={{ fontFamily: "var(--font-outfit)" }}>
          NETFAST
        </h2>
      </motion.div>
    </div>
  );
}
