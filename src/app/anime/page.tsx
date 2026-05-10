import MovieRow from "@/components/MovieRow";
import { fetchMovies } from "@/lib/tmdb";

export default async function AnimePage() {
  const animePopular = await fetchMovies("/discover/movie", { with_genres: "16", with_keywords: "210024" });
  const animeAction = await fetchMovies("/discover/movie", { with_genres: "16,28", with_keywords: "210024" });
  const animeFantasy = await fetchMovies("/discover/movie", { with_genres: "16,14", with_keywords: "210024" });

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 mb-12">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500" style={{ fontFamily: "var(--font-outfit)" }}>
          Anime Universe
        </h1>
        <p className="text-gray-400 mt-2">The best of Japanese animation.</p>
      </div>

      <div className="space-y-16">
        <MovieRow title="Popular Now" category="anime" movies={animePopular} />
        <MovieRow title="Shonen Action" category="anime" movies={animeAction} />
        <MovieRow title="Isekai & Fantasy" category="anime" movies={animeFantasy} />
      </div>
    </main>
  );
}
