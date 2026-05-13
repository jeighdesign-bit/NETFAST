import MyListClient from "@/components/MyListClient";
import { Bookmark } from "lucide-react";

export default function MyListPage() {
  return (
    <main className="min-h-screen pt-44 pb-20">
      <div className="container mx-auto px-6 mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <Bookmark className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>My List</h1>
          <p className="text-gray-400 mt-1">Movies and shows you've saved.</p>
        </div>
      </div>

      <MyListClient />
    </main>
  );
}
