import { TVDetail, fetchTVDetails, getImageUrl } from "@/lib/tmdb";
import MovieInteractiveArea from "@/components/MovieInteractiveArea";
import MovieRow from "@/components/MovieRow";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const tv = await fetchTVDetails(params.id);
  
  return {
    title: tv.name,
    description: tv.overview?.substring(0, 160),
    openGraph: {
      title: `${tv.name} | Watch on NETFAST`,
      description: tv.overview,
      images: [getImageUrl(tv.backdrop_path, "original")],
      type: "video.tv_show",
    },
  };
}

export default async function TVDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const tv = await fetchTVDetails(id);
  
  if (!tv) return <div className="min-h-screen flex items-center justify-center text-white">Show not found.</div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": tv.name,
    "description": tv.overview,
    "image": getImageUrl(tv.poster_path, "original"),
    "datePublished": tv.release_date,
    "numberOfSeasons": tv.number_of_seasons,
    "numberOfEpisodes": tv.number_of_episodes,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tv.vote_average,
      "bestRating": "10",
      "ratingCount": tv.vote_count || 0
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MovieInteractiveArea movie={tv} isTV={true} tvData={tv} />
      
      <div className="container mx-auto px-6 mt-20 md:mt-24">
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
