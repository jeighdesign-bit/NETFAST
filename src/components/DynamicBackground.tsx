"use client";

import { useBackground } from "@/context/BackgroundContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DynamicBackground() {
  const { backdrop } = useBackground();

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {backdrop && (
          <motion.div
            key={backdrop}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={backdrop} 
              alt="Backdrop" 
              className="w-full h-full object-cover blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black -z-10" />
    </div>
  );
}
