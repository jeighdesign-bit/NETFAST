"use client";

import { useState, useEffect } from "react";
import MovieRow from "./MovieRow";
import { Movie, fetchMovies } from "@/lib/tmdb";

export default function PersonalizedRow() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function getRecommendations() {
      // Find most watched genre from info
      const genres: Record<string, number> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("netfast_info_")) {
          const info = JSON.parse(localStorage.getItem(key) || "{}");
          // Since we don't save genres in info yet, we might need to fetch them
          // Or just use a default discovery for now
        }
      }

      // For now, let's just fetch some high-rated ones as "personalized"
      const response = await fetch("/api/search?query=scifi"); // Simulated personalized query
      const data = await response.json();
      setMovies(data.results || []);
    }
    
    getRecommendations();
  }, []);

  if (movies.length === 0) return null;

  return (
    <MovieRow 
      title="Specially Picked For You" 
      category="ai-discover" 
      highlight={true} 
      movies={movies} 
    />
  );
}
