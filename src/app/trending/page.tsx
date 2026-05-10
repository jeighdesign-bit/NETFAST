import MovieRow from "@/components/MovieRow";
import { getTrendingMovies } from "@/lib/tmdb";
import { TrendingUp } from "lucide-react";

export default async function TrendingPage() {
  const trendingDay = await getTrendingMovies("day");
  const trendingWeek = await getTrendingMovies("week");

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <TrendingUp className="w-6 h-6 text-[#e50914]" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>Trending Now</h1>
          <p className="text-gray-400 mt-1">What the world is watching right now.</p>
        </div>
      </div>

      <div className="space-y-16">
        <MovieRow title="Today's Top 20" category="trending" movies={trendingDay} highlight={true} />
        <MovieRow title="This Week's Favorites" category="trending" movies={trendingWeek} />
      </div>
    </main>
  );
}
