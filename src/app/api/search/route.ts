import { NextResponse } from "next/server";
import { searchMovies, fetchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 1. Basic TMDB Search
    let results = await searchMovies(query);

    // 2. If it looks like a genre or mood, try discovery
    // Simple mapping for "AI" feel
    const moods: Record<string, string> = {
      "sad": "18", // Drama
      "scary": "27", // Horror
      "funny": "35", // Comedy
      "action": "28",
      "romantic": "10749",
      "sci-fi": "878",
      "anime": "16"
    };

    const lowercaseQuery = query.toLowerCase();
    for (const [mood, id] of Object.entries(moods)) {
      if (lowercaseQuery.includes(mood)) {
        const moodResults = await fetchMovies("/discover/movie", { with_genres: id });
        // Merge and remove duplicates
        const existingIds = new Set(results.map(m => m.id));
        moodResults.forEach(m => {
          if (!existingIds.has(m.id)) {
            results.push(m);
            existingIds.add(m.id);
          }
        });
      }
    }

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
