import MovieRow from "@/components/MovieRow";
import { fetchMovies, getImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { AlertTriangle, Filter, ArrowRight } from "lucide-react";

export default async function MoviesPage(props: { searchParams: Promise<{ genre?: string; lang?: string }> }) {
  const searchParams = await props.searchParams;
  const genreId = searchParams.genre;
  const lang = searchParams.lang;
  
  const popular = await fetchMovies("/movie/popular");
  const action = await fetchMovies("/discover/movie", { with_genres: "28" });
  const scifi = await fetchMovies("/discover/movie", { with_genres: "878" });
  const thriller = await fetchMovies("/discover/movie", { with_genres: "53" });
  const horror = await fetchMovies("/discover/movie", { with_genres: "27" });
  const comedy = await fetchMovies("/discover/movie", { with_genres: "35" });

  const genres = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "18", name: "Drama" },
    { id: "14", name: "Fantasy" },
    { id: "27", name: "Horror" },
    { id: "878", name: "Sci-Fi" },
    { id: "53", name: "Thriller" },
  ];

  // If we have a specific filter, fetch MORE movies for a grid view
  const gridMovies = genreId 
    ? await fetchMovies("/discover/movie", { with_genres: genreId, page: "1" }) 
    : lang 
      ? await fetchMovies("/discover/movie", { with_original_language: lang, sort_by: "popularity.desc" })
      : null;

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#050505]">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              {lang === 'tl' ? "Pinoy Cinema" : genreId ? genres.find(g => g.id === genreId)?.name || "Category" : "All Movies"}
            </h1>
            <p className="text-gray-500 mt-4 text-lg font-medium max-w-xl">
              {gridMovies ? `Experience the best ${genres.find(g => g.id === genreId)?.name || ""} movies curated by our cinematic AI.` : "Deep dive into our massive library of blockbusters and hidden gems."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 5).map(g => (
              <Link 
                key={g.id} 
                href={`/movies?genre=${g.id}`}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${genreId === g.id ? 'bg-[#e50914] border-[#e50914] text-white' : 'border-white/10 text-gray-500 hover:border-white hover:text-white'}`}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Experience Notice */}
        <div className="mt-12 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex flex-col md:flex-row items-center gap-4 group">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-gray-300 text-xs md:text-sm font-bold tracking-wide uppercase">
              Pro Tip: For best experience, use <span className="text-white">uBlock Origin</span> or <span className="text-white">Brave Browser</span>
            </p>
          </div>
          <div className="md:ml-auto flex items-center gap-2 text-[10px] font-black text-yellow-500/40 uppercase tracking-[0.2em]">
            Optimized for Speed <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {gridMovies ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {gridMovies.map((movie) => {
              const isTV = !movie.title && (movie as any).name;
              const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
              return (
                <Link key={movie.id} href={href} className="group">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-[#e50914]/50 shadow-2xl transition-all duration-500">
                    <SafeImage 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title || (movie as any).name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-black text-lg tracking-tight line-clamp-1 leading-tight">{movie.title || (movie as any).name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-green-400 text-xs font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
                        <span className="text-gray-400 text-xs">{movie.release_date?.substring(0,4)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-24 mt-12">
          <MovieRow title="Popular Hits" category="movies" movies={popular} />
          <MovieRow title="Adrenaline Fueled" category="movies?genre=28" movies={action} />
          <MovieRow title="Future Shock" category="movies?genre=878" movies={scifi} />
          <MovieRow title="Psychological Thrills" category="movies?genre=53" movies={thriller} />
          <MovieRow title="Nightmare Fuel" category="movies?genre=27" movies={horror} />
          <MovieRow title="Endless Laughter" category="movies?genre=35" movies={comedy} />
        </div>
      )}
    </main>
  );
}
