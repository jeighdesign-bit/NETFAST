"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-[#e50914] to-[#8b5cf6] shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageSquare className="w-8 h-8 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[350px] h-[500px] glass rounded-2xl border border-white/20 z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-[#e50914]/20 to-[#8b5cf6]/20 p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center">
                  <span className="font-bold text-xs">AI</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">NETFAST Assistant</h3>
                  <p className="text-[10px] text-green-400">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded-xl rounded-tl-none self-start max-w-[85%] text-gray-200">
                Hi! I'm your AI movie assistant. You can describe a scene, ask for recommendations based on your mood, or search for titles.
              </div>
              <div className="bg-[#e50914]/80 p-3 rounded-xl rounded-tr-none self-end max-w-[85%] text-white">
                Can you recommend a movie where the main character is trapped in a time loop?
              </div>
              <div className="bg-white/10 p-3 rounded-xl rounded-tl-none self-start max-w-[85%] text-gray-200">
                I highly recommend <strong>Edge of Tomorrow</strong> or <strong>Source Code</strong>. Both feature intense time-loop scenarios! Want to watch the trailer?
              </div>
            </div>

            <div className="p-3 border-t border-white/10 bg-black/40">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask me anything..." 
                  className="w-full bg-black/50 border border-white/20 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-[#e50914]"
                />
                <button className="absolute right-2 top-1.5 w-6 h-6 rounded-full bg-[#e50914] flex items-center justify-center hover:bg-[#ff4b4b]">
                  <Send className="w-3 h-3 text-white ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
