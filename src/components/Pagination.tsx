"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: any;
}

export default function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  const router = useRouter();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageUrl(page));
  };

  // Limit total pages to 500 as per TMDB API limits
  const maxPages = Math.min(totalPages, 500);

  return (
    <div className="flex flex-col items-center gap-6 mt-20 mb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold tracking-widest uppercase">
          <span className="text-gray-500">Page</span>{" "}
          <span className="text-white">{currentPage}</span>{" "}
          <span className="text-gray-500 mx-2">of</span>{" "}
          <span className="text-white">{maxPages}</span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === maxPages}
          className="px-8 h-12 rounded-2xl bg-[#e50914] text-white flex items-center justify-center font-black uppercase text-xs tracking-widest hover:bg-[#ff1e2a] transition-all shadow-[0_0_30px_rgba(229,9,20,0.3)] group disabled:opacity-50"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
        Neural Stream • {maxPages * 20} Results
      </p>
    </div>
  );
}
