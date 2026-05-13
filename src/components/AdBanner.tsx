'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  format: '160x300' | '160x600' | '300x250' | '320x50' | '468x60' | '728x90' | 'native';
}

const adConfigs = {
  '160x300': { key: '0e696288c1f0cd161563cdfa98b9e69a', width: 160, height: 300 },
  '160x600': { key: 'a1fc5bd39c93d7939bc129c5f6d8cfde', width: 160, height: 600 },
  '300x250': { key: '6fa3401fb6b11bf15c1ab3dbc325f89e', width: 300, height: 250 },
  '320x50': { key: 'ddc22b558d7318f4fa6036c4d0c29ade', width: 320, height: 50 },
  '468x60': { key: '0551caa7274247b3a993e5bf2f206acb', width: 468, height: 60 },
  '728x90': { key: '4ba56285f56afc024ba1faac28e8eacf', width: 728, height: 90 },
  'native': { key: '1723101ca20f818bcebcd0d7d40cfdce', width: '100%', height: 'auto' },
};

export default function AdBanner({ format }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = adConfigs[format];

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    if (format === 'native') {
      const nativeContainer = document.createElement('div');
      nativeContainer.id = `container-${config.key}`;
      
      const nativeScript = document.createElement('script');
      nativeScript.src = `https://pl29435454.profitablecpmratenetwork.com/${config.key}/invoke.js`;
      nativeScript.async = true;
      nativeScript.setAttribute('data-cfasync', 'false');

      containerRef.current.appendChild(nativeScript);
      containerRef.current.appendChild(nativeContainer);
    } else {
      // Set atOptions on window object - many ad scripts expect this globally
      (window as any).atOptions = {
        key: config.key,
        format: 'iframe',
        height: config.height as number,
        width: config.width as number,
        params: {},
      };
      
      const invokeScript = document.createElement('script');
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
      invokeScript.async = true;

      containerRef.current.appendChild(invokeScript);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      // Clean up global options
      delete (window as any).atOptions;
    };
  }, [format, config]);

  return (
    <div className="flex justify-center my-8 overflow-hidden w-full">
      <div 
        ref={containerRef} 
        style={{ 
          width: typeof config.width === 'number' ? `${config.width}px` : config.width, 
          minHeight: format === 'native' ? '100px' : (typeof config.height === 'number' ? `${config.height}px` : 'auto') 
        }}
        className="bg-white/5 rounded-lg flex flex-col items-center justify-center text-[10px] text-white/20 uppercase tracking-widest border border-white/5 w-full max-w-[1200px]"
      >
        {/* Placeholder text will disappear once the ad loads */}
        <span className="py-4">Advertisement</span>
      </div>
    </div>
  );
}
