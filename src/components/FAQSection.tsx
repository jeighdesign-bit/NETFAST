"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is NETFAST safe and secure to use?",
    answer: "Yes. The official NETFAST platform is built with a secure, clean-code framework designed to protect users while streaming. We do not require registrations or personal data, ensuring a private and safe viewing experience from start to finish."
  },
  {
    question: "Is NETFAST down or what happened to the original site?",
    answer: "NETFAST is always evolving. If the main domain is inaccessible, we typically move to a mirror or update our servers to maintain 99.9% uptime. You can always find the latest active link through our official community channels."
  },
  {
    question: "Is NETFAST legal to watch?",
    answer: "NETFAST operates as a technological discovery platform. We do not host any files on our own servers; instead, we provide a sophisticated AI-powered interface to find and organize publicly available streaming content from across the web."
  },
  {
    question: "Is it safe to watch movies on NETFAST without a VPN?",
    answer: "While NETFAST is built with security in mind, we always recommend using a VPN for any online streaming. A VPN adds an extra layer of encryption to your connection, protecting your identity and ensuring your ISP cannot track your browsing habits."
  },
  {
    question: "How do I download movies from NETFAST?",
    answer: "NETFAST is optimized for high-speed streaming and does not currently offer a native download feature. This ensures that we can provide the fastest possible delivery of 4K content without the storage overhead, keeping our service fast and free."
  },
  {
    question: "What is a Neural Token in a NETFAST stream?",
    answer: "A Neural Token is a unique identifier used by our AI Discovery engine to optimize your playback route. It ensures that you're connected to the fastest available node for your specific geographic location, minimizing buffering and maximizing quality."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#e50914]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#e50914] text-xs font-black uppercase tracking-[0.4em] mb-4 block"
          >
            Support Center
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Questions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Answers to common questions about using NETFAST.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                openIndex === index 
                  ? "bg-white/5 border-[#e50914]/30 shadow-[0_20px_40px_rgba(229,9,20,0.1)]" 
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-all"
              >
                <span className={`text-sm md:text-lg font-black uppercase tracking-tight transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  openIndex === index 
                    ? "bg-[#e50914] text-white rotate-180 shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
                    : "bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-white"
                }`}>
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-6 md:px-8 pb-8 md:pb-10">
                      <div className="h-px w-12 bg-[#e50914]/30 mb-6" />
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {/* Help Link Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
            Still have questions? <a href="#" className="text-[#e50914] hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </section>
  );
}
