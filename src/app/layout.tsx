import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "NETFAST | AI-Powered Cinematic Experience",
    template: "%s | NETFAST"
  },
  description: "NETFAST is the next-generation futuristic entertainment platform. Stream movies, anime, and TV shows with AI-powered discovery and lightning-fast playback.",
  keywords: ["movies", "streaming", "anime", "cinema", "AI movie recommendations", "NETFAST", "watch movies online"],
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
    url: "https://netfast.vercel.app",
    siteName: "NETFAST",
    title: "NETFAST | Watch Movies & Anime Online",
    description: "Stream the latest blockbusters and trending anime on NETFAST. AI-powered search and ad-free experience.",
    images: [
      {
        url: "https://netfast.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NETFAST Cinematic Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NETFAST | AI-Powered Cinematic Experience",
    description: "The future of movie discovery is here. Stream now on NETFAST.",
    images: ["https://netfast.vercel.app/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark antialiased`}>
      <body className="bg-black text-white overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Chatbot />
        <footer className="py-10 border-t border-white/10 mt-20 relative z-10 bg-black/60 backdrop-blur-md">
          <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} NETFAST. Futuristic Entertainment. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
