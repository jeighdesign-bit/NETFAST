import AISearch from "@/components/AISearch";
import MovieRow from "@/components/MovieRow";
import { fetchMovies } from "@/lib/tmdb";
import { Sparkles } from "lucide-react";

export default async function AIDiscoverPage() {
  const recommendations = await fetchMovies("/discover/movie", { sort_by: "vote_average.desc", "vote_count.gte": "1000" });
  const trending = await fetchMovies("/movie/upcoming");

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 mb-16 text-center max-w-3xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#e50914] to-[#8b5cf6] mb-6 shadow-[0_0_30px_rgba(229,9,20,0.6)]">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500" style={{ fontFamily: "var(--font-outfit)" }}>
          AI Semantic Discovery
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Describe exactly what you're looking for. Our advanced AI will analyze the cinematic universe to find the perfect match.
        </p>
        
        <AISearch />
      </div>

      <div className="space-y-16">
        <MovieRow title="Your Personalized Matches" category="ai-discover" highlight={true} movies={recommendations} />
        <MovieRow title="Trending AI Picks" category="ai-discover" movies={trending} />
      </div>
    </main>
  );
}
