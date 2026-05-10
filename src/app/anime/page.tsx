import MovieRow from "@/components/MovieRow";
import { fetchMovies } from "@/lib/tmdb";
import { Sparkles, AlertTriangle } from "lucide-react";

export default async function AnimePage() {
  const animePopular = await fetchMovies("/discover/movie", { with_genres: "16", sort_by: "popularity.desc" });
  const animeAction = await fetchMovies("/discover/movie", { with_genres: "16,28", sort_by: "vote_count.desc" });
  const animeFantasy = await fetchMovies("/discover/movie", { with_genres: "16,14", sort_by: "popularity.desc" });

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#050505]">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
            Anime <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Universe</span>
          </h1>
        </div>
        <p className="text-gray-500 text-lg max-w-2xl font-medium">
          Step into worlds of infinite imagination. From high-octane shonen to breathtaking fantasy adventures.
        </p>

        {/* Experience Notice */}
        <div className="mt-12 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex items-center gap-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
          <p className="text-gray-300 text-xs md:text-sm font-bold tracking-wide uppercase">
            Best View: Use <span className="text-white">uBlock Origin</span> or <span className="text-white">Brave Browser</span> for ad-free streaming.
          </p>
        </div>
      </div>

      <div className="space-y-24">
        <MovieRow title="Top Anime Hits" category="anime" movies={animePopular} />
        <MovieRow title="Explosive Action" category="anime" movies={animeAction} />
        <MovieRow title="Magical Worlds" category="anime" movies={animeFantasy} />
      </div>
    </main>
  );
}
