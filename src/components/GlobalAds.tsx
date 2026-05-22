'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalAds() {
  const pathname = usePathname();

  useEffect(() => {
    // Popunder
    const popunderScript = document.createElement('script');
    popunderScript.src = 'https://pl29432416.profitablecpmratenetwork.com/9d/7e/4b/9d7e4bd0a0c3ced5592326dcc7c03623.js';
    popunderScript.async = true;
    document.body.appendChild(popunderScript);

    // SocialBar
    const socialBarScript = document.createElement('script');
    socialBarScript.src = 'https://pl29432417.profitablecpmratenetwork.com/c5/1a/2c/c51a2c10f7ae17759af945b7e2dcdefb.js';
    socialBarScript.async = true;
    document.body.appendChild(socialBarScript);

    return () => {
      if (document.body.contains(popunderScript)) {
        document.body.removeChild(popunderScript);
      }
      if (document.body.contains(socialBarScript)) {
        document.body.removeChild(socialBarScript);
      }
    };
  }, [pathname]);

  return null;
}
