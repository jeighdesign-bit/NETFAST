import MovieRow from "@/components/MovieRow";
import { fetchMovies } from "@/lib/tmdb";

export default async function MoviesPage(props: { searchParams: Promise<{ genre?: string; lang?: string }> }) {
  const searchParams = await props.searchParams;
  const genreId = searchParams.genre;
  const lang = searchParams.lang;
  
  const popular = await fetchMovies("/movie/popular");
  const genreMovies = genreId ? await fetchMovies("/discover/movie", { with_genres: genreId }) : null;
  const langMovies = lang ? await fetchMovies("/discover/movie", { with_original_language: lang, sort_by: "popularity.desc" }) : null;
  const action = await fetchMovies("/discover/movie", { with_genres: "28" });
  const scifi = await fetchMovies("/discover/movie", { with_genres: "878" });
  const thriller = await fetchMovies("/discover/movie", { with_genres: "53" });

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 mb-12">
        <h1 className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>
          {genreId ? "Genre Results" : "Movies"}
        </h1>
        <p className="text-gray-400 mt-2">Explore the cinematic universe.</p>
      </div>

      <div className="space-y-16">
        {genreMovies && <MovieRow title="Category Results" category="movies" movies={genreMovies} highlight={true} />}
        {langMovies && <MovieRow title="Regional Favorites" category="movies" movies={langMovies} highlight={true} />}
        <MovieRow title="Blockbusters" category="movies" movies={popular} />
        <MovieRow title="High-Octane Action" category="movies" movies={action} />
        <MovieRow title="Sci-Fi Thrills" category="movies" movies={scifi} />
        <MovieRow title="Edge of Your Seat" category="movies" movies={thriller} />
      </div>
    </main>
  );
}
