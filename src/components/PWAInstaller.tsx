"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Tv, Sparkles } from "lucide-react";

// Declare global window properties for TS
declare global {
  interface Window {
    deferredInstallPrompt: any;
    triggerPWAInstall: (() => void) | undefined;
  }
}

export default function PWAInstaller() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed & opened as app)
    const isApp = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;
    
    setIsStandalone(isApp);

    // 2. Register Service Worker
    if ("serviceWorker" in navigator && !isApp) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });
    }

    // 3. Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser-driven install mini-infobar
      e.preventDefault();
      
      // Save the event so it can be triggered later
      window.deferredInstallPrompt = e;
      setInstallPrompt(e);

      // Check if user dismissed the prompt in the last 7 days
      const isDismissed = localStorage.getItem("netfast_pwa_prompt_dismissed");
      const dismissedTime = localStorage.getItem("netfast_pwa_prompt_dismissed_time");
      
      let shouldShow = true;
      if (isDismissed === "true" && dismissedTime) {
        const timeDiff = Date.now() - parseInt(dismissedTime);
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        if (daysDiff < 7) {
          shouldShow = false; // Do not show if dismissed in the last 7 days
        }
      }

      if (shouldShow && !isApp) {
        // Delay showing the prompt slightly for better user experience
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    // 4. Listen for successful install
    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed!");
      setShowPrompt(false);
      setInstallPrompt(null);
      window.deferredInstallPrompt = null;
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Expose trigger globally so Navbar/other UI can launch PWA installation
    window.triggerPWAInstall = () => {
      const savedPrompt = window.deferredInstallPrompt || installPrompt;
      if (savedPrompt) {
        savedPrompt.prompt();
        savedPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === "accepted") {
            console.log("[PWA] User accepted the install prompt");
            setShowPrompt(false);
          } else {
            console.log("[PWA] User dismissed the install prompt");
          }
          window.deferredInstallPrompt = null;
          setInstallPrompt(null);
        });
      } else {
        alert("PWA installation is already complete, or is not supported by your current browser/device (try using Google Chrome or Brave on Android).");
      }
    };

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.triggerPWAInstall = undefined;
    };
  }, [installPrompt]);

  const handleInstallClick = () => {
    if (window.triggerPWAInstall) {
      window.triggerPWAInstall();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("netfast_pwa_prompt_dismissed", "true");
    localStorage.setItem("netfast_pwa_prompt_dismissed_time", Date.now().toString());
  };

  // If already standalone, or prompt should not show, return null
  if (isStandalone || !showPrompt || !installPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-[99999] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] neon-border-subtle"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-[#e50914] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.55)] shrink-0">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-sm font-black uppercase tracking-wide text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                Install NETFAST App
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-[#e50914] animate-pulse" />
            </div>
            <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[220px]">
              Fast. Simple. Free Streaming. Install on your device for a lightweight mobile app experience!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={handleDismiss}
            className="py-2.5 rounded-xl border border-white/15 hover:border-white/25 hover:bg-white/5 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white transition-all active:scale-95 text-center"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff1e2a] hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] text-xs font-black uppercase tracking-wider text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Install App
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
