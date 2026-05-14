'use client';

import { useEffect, useRef } from 'react';

interface ExoclickBannerProps {
  zoneId: string;
}

export default function ExoclickBanner({ zoneId }: ExoclickBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // Load Exoclick ad provider script
    const providerScript = document.createElement('script');
    providerScript.src = 'https://a.magsrv.com/ad-provider.js';
    providerScript.async = true;
    providerScript.type = 'application/javascript';

    // Create the <ins> element Exoclick needs
    const ins = document.createElement('ins');
    ins.className = 'eas6a97888e2';
    ins.setAttribute('data-zoneid', zoneId);

    // Create the AdProvider push script
    const pushScript = document.createElement('script');
    pushScript.text = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;

    containerRef.current.appendChild(providerScript);
    containerRef.current.appendChild(ins);
    containerRef.current.appendChild(pushScript);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [zoneId]);

  return (
    <div className="flex justify-center items-center my-6 overflow-hidden w-full">
      <div
        ref={containerRef}
        className="w-full max-w-[728px] min-h-[90px] bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest"
      />
    </div>
  );
}
