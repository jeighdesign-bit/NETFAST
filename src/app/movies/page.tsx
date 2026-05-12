import MovieRow from "@/components/MovieRow";
import { fetchMovies, fetchTMDB, getImageUrl } from "@/lib/tmdb";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { AlertTriangle, Filter, ArrowRight, Compass } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";

export default async function MoviesPage(props: { searchParams: Promise<{ genre?: string; lang?: string; page?: string; search?: string; sort?: string; year?: string; type?: string; network?: string }> }) {
  const searchParams = await props.searchParams;
  const genreId = searchParams.genre;
  const lang = searchParams.lang;
  const page = searchParams.page || "1";
  const search = searchParams.search;
  const sort = searchParams.sort;
  const year = searchParams.year;
  const type = searchParams.type || "movie";
  const network = searchParams.network;
  
  let popular: any[] = [];
  let action: any[] = [];
  let scifi: any[] = [];
  let thriller: any[] = [];
  let horror: any[] = [];
  let comedy: any[] = [];

  try {
    popular = await fetchMovies("/movie/popular");
    action = await fetchMovies("/discover/movie", { with_genres: "28" });
    scifi = await fetchMovies("/discover/movie", { with_genres: "878" });
    thriller = await fetchMovies("/discover/movie", { with_genres: "53" });
    horror = await fetchMovies("/discover/movie", { with_genres: "27" });
    comedy = await fetchMovies("/discover/movie", { with_genres: "35" });
  } catch (e) {
    console.error("Fetch error:", e);
  }

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

  const networksList: Record<string, string> = {
    "213": "Netflix",
    "49": "HBO",
    "2739": "Disney+",
    "2552": "Apple TV+",
    "1024": "Amazon Prime",
    "453": "Hulu"
  };

  // Map sort to TMDB endpoint or discover params
  let endpoint = search ? "/search/multi" : (type === "tv" || network ? "/discover/tv" : "/discover/movie");
  
  const params: any = { 
    page,
    with_genres: genreId || "", 
    with_original_language: lang || "",
    include_adult: "true",
    sort_by: "popularity.desc" 
  };

  if (search) {
    params.query = search;
    // For search, we don't use discovery filters that break the endpoint
  } else {
    if (year) params.primary_release_year = year;
    if (network) params.with_networks = network;
    
    if (sort === "trending") endpoint = `/trending/${type}/week`;
    if (sort === "top_rated") endpoint = `/${type}/top_rated`;
    if (sort === "upcoming") endpoint = "/movie/upcoming";
    if (sort === "now_playing") endpoint = "/movie/now_playing";
    if (sort === "airing_today") endpoint = "/tv/airing_today";
    if (sort === "new") {
      endpoint = `/${type}/now_playing`;
      if (type === "tv") endpoint = "/tv/on_the_air";
    }
  }

  // If we have any filter OR we are on a secondary page OR searching, show grid
  const isBrowsing = genreId || lang || page !== "1" || search || sort || year || type !== "movie" || network;

  let gridData = null;
  try {
    gridData = isBrowsing ? await fetchTMDB(endpoint, params) : null;
  } catch (e) {
    console.error("Grid fetch error:", e);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <main className="min-h-screen pt-44 pb-20 bg-[#050505]">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 text-[#e50914]">
              <Compass className="w-6 h-6 animate-spin-slow" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Cinematic Exploration</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: "var(--font-outfit)" }}>
              {search ? `Search: ${search}` : 
               network ? `${networksList[network] || 'Network'} Originals` :
               sort === "trending" ? "Trending Now" :
               sort === "top_rated" ? "Top Rated" :
               sort === "upcoming" ? "Upcoming Movies" :
               sort === "new" ? "New Releases" :
               year === "2026" ? "2026 Movies" :
               type === "tv" ? "TV Shows" :
               lang === 'tl' ? "Pinoy Cinema" : 
               genreId ? genres.find(g => g.id === genreId)?.name || "Category" : 
               "All Movies"}
            </h1>
            <p className="text-gray-500 mt-4 text-lg font-medium max-w-xl">
              {search ? `Displaying cinematic results for "${search}" from our neural library.` : 
               network ? `Exclusive content produced by ${networksList[network] || 'the network'}.` :
               sort ? `Discover the latest ${sort.replace('_', ' ')} content curated by our AI.` :
               year ? `A glimpse into the future with ${year} cinema.` :
               type === "tv" ? "The best television series from around the world." :
               gridData ? `Exploring ${genres.find(g => g.id === genreId)?.name || "the best"} cinema from around the globe.` : 
               "Deep dive into our massive library of blockbusters and hidden gems."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {genres.slice(0, 5).map(g => (
              <Link 
                key={g.id} 
                href={`/movies?genre=${g.id}`}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${genreId === g.id ? 'bg-[#e50914] border-[#e50914] text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]' : 'border-white/10 text-gray-500 hover:border-white hover:text-white'}`}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {gridData ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {gridData.results.map((movie: any) => {
              const isTV = !movie.title && (movie as any).name;
              const href = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
              return (
                <Link key={movie.id} href={href} className="group">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-white/5 group-hover:border-[#e50914]/50 shadow-2xl transition-all duration-500 bg-[#111]">
                    <SafeImage 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title || (movie as any).name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-black text-lg tracking-tight line-clamp-1 leading-tight">{movie.title || (movie as any).name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-green-400 text-xs font-bold">{movie.vote_average ? `${Math.round(movie.vote_average * 10)}% Match` : 'Highly Rated'}</span>
                        <span className="text-gray-400 text-xs">{movie.release_date?.substring(0,4)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination currentPage={gridData.page} totalPages={gridData.total_pages} searchParams={searchParams} />
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
    </Suspense>
  );
}
