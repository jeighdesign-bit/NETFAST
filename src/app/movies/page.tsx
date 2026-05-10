import MovieRow from "@/components/MovieRow";
import { fetchMovies, getImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export default async function MoviesPage(props: { searchParams: Promise<{ genre?: string; lang?: string }> }) {
  const searchParams = await props.searchParams;
  const genreId = searchParams.genre;
  const lang = searchParams.lang;
  
  const popular = await fetchMovies("/movie/popular");
  const action = await fetchMovies("/discover/movie", { with_genres: "28" });
  const scifi = await fetchMovies("/discover/movie", { with_genres: "878" });
  const thriller = await fetchMovies("/discover/movie", { with_genres: "53" });

  // If we have a specific filter, fetch MORE movies for a grid view
  const gridMovies = genreId 
    ? await fetchMovies("/discover/movie", { with_genres: genreId, page: "1" }) 
    : lang 
      ? await fetchMovies("/discover/movie", { with_original_language: lang, sort_by: "popularity.desc" })
      : null;

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 mb-12">
        <h1 className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>
          {lang === 'tl' ? "Pinoy Blockbusters" : genreId ? "Category Results" : "Movies"}
        </h1>
        <p className="text-gray-400 mt-2">
          {gridMovies ? `Showing results for your selection` : "Explore the cinematic universe."}
        </p>
      </div>

      {gridMovies ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {gridMovies.map((movie) => {
              const isTV = !movie.title && (movie as any).name;
              const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
              return (
                <Link key={movie.id} href={href}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-[#e50914]/50 transition-all">
                    <SafeImage 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title || (movie as any).name} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                      <p className="text-white font-bold text-sm line-clamp-1">{movie.title || (movie as any).name}</p>
                      <p className="text-[#e50914] text-xs font-medium">{movie.vote_average.toFixed(1)} Rating</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          <MovieRow title="Blockbusters" category="movies" movies={popular} />
          <MovieRow title="High-Octane Action" category="movies" movies={action} />
          <MovieRow title="Sci-Fi Thrills" category="movies" movies={scifi} />
          <MovieRow title="Edge of Your Seat" category="movies" movies={thriller} />
        </div>
      )}
    </main>
  );
}
