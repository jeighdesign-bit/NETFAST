import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "NETFAST | AI-Powered Cinematic Experience",
  description: "Next-generation futuristic entertainment platform with AI movie recommendations and discovery.",
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
