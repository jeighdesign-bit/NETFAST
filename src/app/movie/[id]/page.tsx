import { fetchMovieDetails, getImageUrl } from "@/lib/tmdb";
import MovieRow from "@/components/MovieRow";
import MovieInteractiveArea from "@/components/MovieInteractiveArea";
import Image from "next/image";

export default async function MovieDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const movie = await fetchMovieDetails(params.id);
  
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer")?.key;
  const similarMovies = movie.similar?.results || [];

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Hero */}
      <MovieInteractiveArea movie={movie} />

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Storyline</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {movie.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {movie.genres?.map(g => (
                <span key={g.id} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl border border-white/10 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Movie Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Release Date</span>
                <span className="text-white">{movie.release_date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Runtime</span>
                <span className="text-white">{movie.runtime} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
              </div>
            </div>
          </div>
        </div>

        {trailer && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>Official Trailer</h2>
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <iframe 
                src={`https://www.youtube.com/embed/${trailer}?autoplay=0`} 
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="pb-20">
          <MovieRow title="More Like This" category="similar" movies={similarMovies} />
        </div>
      </div>
    </div>
  );
}
