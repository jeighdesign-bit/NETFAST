'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const config = adConfigs[format];
  const [nativeHeight, setNativeHeight] = useState<number>(250);

  useEffect(() => {
    if (format !== 'native' || !config) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ad-height' && event.data.key === config.key) {
        const height = Number(event.data.height);
        if (!isNaN(height) && height > 0) {
          setNativeHeight(height);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [format, config]);

  if (!config) return null;

  const isNative = format === 'native';
  const width = isNative ? '100%' : `${config.width}px`;
  const height = isNative ? `${nativeHeight}px` : `${config.height}px`;

  // Construct iframe html
  let srcDoc = '';
  if (isNative) {
    srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 0;
              background: transparent;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <div id="container-${config.key}"></div>
          <script async="async" data-cfasync="false" src="https://pl29435454.profitablecpmratenetwork.com/${config.key}/invoke.js"></script>
          <script>
            function sendHeight() {
              var height = document.documentElement.scrollHeight || document.body.scrollHeight;
              window.parent.postMessage({ type: 'ad-height', key: '${config.key}', height: height }, '*');
            }
            window.addEventListener('load', function() {
              sendHeight();
              setTimeout(sendHeight, 1000);
              setTimeout(sendHeight, 3000);
              setTimeout(sendHeight, 5000);
            });
            if (window.ResizeObserver) {
              var ro = new ResizeObserver(sendHeight);
              ro.observe(document.body);
            }
          </script>
        </body>
      </html>
    `;
  } else {
    srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: transparent;
              overflow: hidden;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '${config.key}',
              'format' : 'iframe',
              'height' : ${config.height},
              'width' : ${config.width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js"></script>
        </body>
      </html>
    `;
  }

  // Generate a key based on route pathname and config key to force recreate iframe
  const iframeKey = `${format}-${config.key}-${pathname}`;

  return (
    <div className="flex justify-center my-4 overflow-hidden w-full mx-auto">
      <div 
        style={{ 
          width: isNative ? '100%' : width, 
          height: height,
          maxWidth: '1200px'
        }}
        className="bg-white/5 rounded-lg flex flex-col items-center justify-center border border-white/5 w-full relative transition-all duration-300"
      >
        <iframe
          key={iframeKey}
          srcDoc={srcDoc}
          title={`Adsterra ${format} Ad`}
          style={{
            border: 'none',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
          scrolling="no"
        />
      </div>
    </div>
  );
}
