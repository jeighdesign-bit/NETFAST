"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TVDetail, fetchTVDetails, getImageUrl } from "@/lib/tmdb";
import MovieInteractiveArea from "@/components/MovieInteractiveArea";
import MovieRow from "@/components/MovieRow";

export default function TVDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tv, setTv] = useState<TVDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchTVDetails(id);
      setTv(data);
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" /></div>;
  if (!tv) return <div className="min-h-screen flex items-center justify-center text-white">Show not found.</div>;

  return (
    <main className="min-h-screen pb-20">
      <MovieInteractiveArea movie={tv} isTV={true} tvData={tv} />
      
      <div className="container mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">About {tv.name}</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {tv.overview}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-gray-500 block text-sm uppercase tracking-widest mb-1">Status</span>
                <span className="text-white font-medium">Returning Series</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm uppercase tracking-widest mb-1">Seasons</span>
                <span className="text-white font-medium">{tv.number_of_seasons}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm uppercase tracking-widest mb-1">Total Episodes</span>
                <span className="text-white font-medium">{tv.number_of_episodes}</span>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl border border-white/10 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Series Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">First Aired</span>
                <span className="text-white">{tv.release_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-green-400 font-bold">{Math.round(tv.vote_average * 10)}% Match</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Quality</span>
                <span className="text-white border border-white/20 px-1 rounded text-[10px]">ULTRA HD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
