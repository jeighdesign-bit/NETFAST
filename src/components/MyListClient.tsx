"use client";

import { useState, useEffect } from "react";
import MovieRow from "./MovieRow";
import { Movie } from "@/lib/tmdb";

export default function MyListClient() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("netfast_mylist") || "[]");
    setMovies(list);
  }, []);

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-gray-500 text-xl">Your list is empty. Start adding movies to watch them later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <MovieRow title="Saved for Later" category="my-list" movies={movies} />
    </div>
  );
}
