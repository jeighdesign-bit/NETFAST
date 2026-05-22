import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BackgroundProvider } from "@/context/BackgroundContext";
import DynamicBackground from "@/components/DynamicBackground";
import GlobalAds from "@/components/GlobalAds";
import ClientSideComponents from "@/components/ClientSideComponents";
import AdBanner from "@/components/AdBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "NETFAST | Fast. Simple. Free Streaming.",
    template: "%s | NETFAST"
  },
  description: "NETFAST | Stream the latest movies, Pinoy blockbusters, TV shows, and trending anime for free. Experience the future of cinema with AI-powered discovery and ultra-fast streaming on netfast.stream.",
  keywords: ["movies", "streaming", "anime", "cinema", "AI movie recommendations", "NETFAST", "watch movies online", "free pinoy movies", "tagalog movies", "latest tv shows", "netfast stream"],
  authors: [{ name: "NETFAST Team" }],
  creator: "NETFAST",
  publisher: "NETFAST",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://netfast.stream",
    siteName: "NETFAST",
    title: "NETFAST | Watch Movies, TV Shows & Anime Online Free",
    description: "Watch the latest movies and trending anime on NETFAST. AI-powered search, lightning-fast streaming, and a premium cinematic experience on netfast.stream.",
    images: [
      {
        url: "https://netfast.stream/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NETFAST Cinematic Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NETFAST | Fast. Simple. Free Streaming.",
    description: "The future of movie discovery is here. Stream movies and anime for free on netfast.stream.",
    images: ["https://netfast.stream/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.ico", color: "#e50914" },
    ],
  },
  manifest: "/manifest.json",
};

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark antialiased`}>
      <head>
        <meta name="6a97888e-site-verification" content="471ece48be511e3bd2035444764b2aab" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NETFAST" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-black text-white overflow-x-hidden min-h-screen flex flex-col">
        <BackgroundProvider>
          <GlobalAds />
          <DynamicBackground />
          <Navbar />
          <div className="flex-1 pb-16 md:pb-0">
            {children}
          </div>

          {/* Sticky Mobile Banner */}
          <div className="fixed bottom-0 left-0 right-0 z-[90] flex justify-center items-center bg-black/80 backdrop-blur-md md:hidden py-1 border-t border-white/5">
            <AdBanner format="320x50" />
          </div>

          <ClientSideComponents />
          <Analytics />
        </BackgroundProvider>
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 relative z-10 mt-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2">
                <Link href="/" className="text-3xl font-black text-white tracking-tighter mb-6 block">
                  NET<span className="text-[#e50914]">FAST</span>
                </Link>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  The world's most advanced AI-powered streaming platform. Experience the future of cinema with neural discovery and 4K ultra-speed delivery.
                </p>
                <div className="flex gap-4 mt-8">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e50914] transition-colors cursor-pointer">
                    <span className="text-white text-[10px] font-bold">FB</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e50914] transition-colors cursor-pointer">
                    <span className="text-white text-[10px] font-bold">TW</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e50914] transition-colors cursor-pointer">
                    <span className="text-white text-[10px] font-bold">IG</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Browse</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  <li><Link href="/movies" className="hover:text-white transition-colors">All Movies</Link></li>
                  <li><Link href="/movies?type=tv" className="hover:text-white transition-colors">TV Series</Link></li>
                  <li><Link href="/movies?sort=trending" className="hover:text-white transition-colors">Trending</Link></li>
                  <li><Link href="/movies?sort=top_rated" className="hover:text-white transition-colors">Top Rated</Link></li>
                  <li><Link href="/movies?year=2026" className="hover:text-white transition-colors">2026 Releases</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Genres</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  <li><Link href="/movies?genre=28" className="hover:text-white transition-colors">Action</Link></li>
                  <li><Link href="/movies?genre=16" className="hover:text-white transition-colors">Anime</Link></li>
                  <li><Link href="/movies?genre=27" className="hover:text-white transition-colors">Horror</Link></li>
                  <li><Link href="/movies?genre=878" className="hover:text-white transition-colors">Sci-Fi</Link></li>
                  <li><Link href="/movies?genre=10749" className="hover:text-white transition-colors">Romance</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                  <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">DMCA</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-600 text-[10px] font-medium">
                © {new Date().getFullYear()} NETFAST Neural Cinema. All rights reserved. Built with Next.js 16.
              </p>
              <div className="flex gap-8 text-gray-600 text-[10px] uppercase font-bold tracking-widest">
                <span>128-bit Encryption</span>
                <span>4K Optimized</span>
                <span>AI Discovery</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
