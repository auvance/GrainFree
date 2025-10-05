"use client";

import { useEffect, useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

type Recipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  nutrition?: {
    nutrients?: { name: string; amount: number; unit: string }[];
  };
};

export default function GrainFreeHub() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  // ─── Fetch gluten-free recipes ───────────────────────────────
  const fetchRecipes = async (searchQuery?: string) => {
    try {
      setLoading(true);
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${
        searchQuery || "gluten free"
      }&number=12&addRecipeNutrition=true&diet=gluten%20free&apiKey=${SPOONACULAR_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(); // Default load
  }, []);

  // ─── Handle search ───────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(query);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF5] text-black">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-[3.5rem] font-extrabold mb-4">
          <span className="text-black">Grain</span>
          <span className="text-[#009B3E]">FreeHub</span>
        </h1>
        <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
          Search, filter and find what works for you — meals, snacks, and
          everything in between.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-10 flex justify-center w-full max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search for allergen-free foods..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full px-6 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009B3E]"
          />
        </form>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <p className="text-center text-gray-600">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-600">
            No results found. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recipes.map((recipe) => {
              const calories =
                recipe.nutrition?.nutrients?.find(
                  (n) => n.name === "Calories"
                )?.amount || 0;

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Ready in {recipe.readyInMinutes} min
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#009B3E] font-medium">
                        {Math.round(calories)} kcal
                      </span>
                      <button className="text-[#009B3E] hover:underline">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
