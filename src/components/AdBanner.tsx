'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  format: '160x300' | '160x600' | '300x250' | '320x50' | '468x60' | '728x90';
}

const adConfigs = {
  '160x300': { key: '0e696288c1f0cd161563cdfa98b9e69a', width: 160, height: 300 },
  '160x600': { key: 'a1fc5bd39c93d7939bc129c5f6d8cfde', width: 160, height: 600 },
  '300x250': { key: '6fa3401fb6b11bf15c1ab3dbc325f89e', width: 300, height: 250 },
  '320x50': { key: 'ddc22b558d7318f4fa6036c4d0c29ade', width: 320, height: 50 },
  '468x60': { key: '0551caa7274247b3a993e5bf2f206acb', width: 468, height: 60 },
  '728x90': { key: '4ba56285f56afc024ba1faac28e8eacf', width: 728, height: 90 },
};

export default function AdBanner({ format }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = adConfigs[format];

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    const atOptions = {
      key: config.key,
      format: 'iframe',
      height: config.height,
      width: config.width,
      params: {},
    };

    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `atOptions = ${JSON.stringify(atOptions)};`;
    
    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
    invokeScript.async = true;

    containerRef.current.appendChild(optionsScript);
    containerRef.current.appendChild(invokeScript);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [format, config]);

  return (
    <div className="flex justify-center my-8 overflow-hidden">
      <div 
        ref={containerRef} 
        style={{ width: config.width, height: config.height }}
        className="bg-white/5 rounded-lg flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest border border-white/5"
      >
        Advertisement
      </div>
    </div>
  );
}
