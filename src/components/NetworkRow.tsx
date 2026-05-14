"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const networks = [
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", id: "213" },
  { name: "HBO", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg", id: "49" },
  { name: "Disney+", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", id: "2739" },
  { name: "Apple TV+", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg", id: "2552" },
  { name: "Amazon Prime", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg", id: "1024" },
  { name: "Hulu", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg", id: "453" },
];

export default function NetworkRow() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Premium Networks</h2>
        <div className="h-1 w-12 bg-[#e50914] mt-2" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
        {networks.map((network) => (
          <Link 
            key={network.id} 
            href={`/movies?network=${network.id}`}
            className="group"
          >
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative h-24 bg-white/5 rounded-2xl flex items-center justify-center p-6 border border-white/5 group-hover:border-white/20 transition-all backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full">
                <img 
                  src={network.logo} 
                  alt={network.name} 
                  className="w-full h-full object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500" 
                />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
