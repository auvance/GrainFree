"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Image from "next/image";

type Item = {
  id?: number;
  code?: string;
  title?: string;
  product_name?: string;
  image?: string;
  image_front_url?: string;
  readyInMinutes?: number;
  nutrition?: {
    nutrients?: { name: string; amount: number; unit: string }[];
  };
  nutriments?: {
    "energy-kcal"?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
  type: "meal" | "product";
};

export default function PageGrainfreehub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [source, setSource] = useState<"meals" | "products">("meals");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  const filters = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Vegetarian",
    "Vegan",
    "Low Carb",
    "High Protein",
    "Dairy Free",
    "Nut Free",
    "Fish Free",
  ];

  // ────────────────────────────────────────────────────────────
  // Fetch Spoonacular Meals
  // ────────────────────────────────────────────────────────────
  const fetchRecipes = async (searchQuery?: string, filterType?: string) => {
    try {
      setLoading(true);
      setApiError(false);

      const baseQuery = searchQuery?.trim() || "healthy";
      let dietParam: string | undefined;
      let intolerancesParam: string | undefined;
      let suffix = "";

      switch ((filterType || "All").toLowerCase()) {
        case "all":
          break;
        case "breakfast":
        case "lunch":
        case "dinner":
        case "snacks":
          suffix = ` ${filterType!.toLowerCase()}`;
          break;
        case "vegetarian":
          dietParam = "vegetarian";
          break;
        case "vegan":
          dietParam = "vegan";
          break;
        case "low carb":
          dietParam = "ketogenic";
          break;
        case "high protein":
          suffix = " high protein";
          break;
        case "dairy free":
          intolerancesParam = "dairy";
          break;
        case "nut free":
          intolerancesParam = "peanut,tree nut";
          break;
        case "fish free":
          intolerancesParam = "fish";
          break;
      }

      const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
      url.searchParams.set("query", `${baseQuery}${suffix}`.trim());
      url.searchParams.set("number", "12");
      url.searchParams.set("addRecipeNutrition", "true");
      url.searchParams.set("apiKey", String(SPOONACULAR_KEY));
      if (dietParam) url.searchParams.set("diet", dietParam);
      if (intolerancesParam)
        url.searchParams.set("intolerances", intolerancesParam);

      const res = await fetch(url.toString());

      if ([402, 429, 401].includes(res.status)) {
        setApiError(true);
        setItems([]);
        return;
      }

      const data = await res.json();
      setItems(
        (data.results || []).map((r: any) => ({
          ...r,
          type: "meal",
        }))
      );
    } catch (err) {
      console.error("Recipe fetch error:", err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // Fetch OpenFoodFacts Products
  // ────────────────────────────────────────────────────────────
  const fetchProducts = async (searchQuery?: string) => {
    try {
      setLoading(true);
      setApiError(false);

      const q = searchQuery?.trim() || "gluten-free";

      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        q
      )}&tagtype_0=labels&tag_contains_0=contains&tag_0=gluten-free&json=1&page_size=12`;

      const res = await fetch(url, {
        next: { revalidate: 3600 } // cache for 1 hour
      });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      setItems(
        (data.products || []).map((p: any) => ({
          ...p,
          type: "product",
        }))
      );
    } catch (err) {
      console.error("Product fetch error:", err);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────
  // Event Handlers
  // ────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    source === "products" ? fetchProducts(query) : fetchRecipes(query, filter);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (source === "meals") fetchRecipes(query, value);
  };

  // ────────────────────────────────────────────────────────────
  // Load initial data
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    source === "products" ? fetchProducts() : fetchRecipes();
  }, [source]);

  return (
    <main className="min-h-screen bg-[#FAFAF5] text-black">
      <Header />

      <section className="text-center py-16">
        <h1 className="text-[5.5rem] font-extrabold">
          <span className="text-black font-[AeonikArabic]">Grain</span>
          <span className="text-[#009B3E] font-[AeonikArabic]">FreeHub</span>
        </h1>
        <p className="text-[1.5rem] font-[AeonikArabic] font-bold text-gray-600">
          Your ultimate resource for grain-free meals and products.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mt-10 flex flex-wrap justify-center w-full max-w-3xl mx-auto gap-3 font-[AeonikArabic]"
        >
          <input
            type="text"
            placeholder="Search foods, meals, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow rounded-full px-6 py-3 border border-gray-300 focus:ring-2 focus:ring-[#009B3E] font-[AeonikArabic]"
          />

          {/* Source Toggle */}
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as "meals" | "products")
            }
            className="rounded-full border border-gray-300 px-4 py-3 bg-white font-[AeonikArabic]"
          >
            <option value="meals">Meals</option>
            <option value="products">Products</option>
          </select>

          {/* Filters (Meals only) */}
          <select
            value={filter}
            disabled={source === "products"}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-full border border-gray-300 px-4 py-3 bg-white disabled:opacity-40 font-[AeonikArabic]"
          >
            {filters.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </form>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-gray-600 font-[AeonikArabic]">Loading...</p>
        ) : apiError ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-[#009B3E] mb-3 font-[AeonikArabic]">
              API Limit Reached
            </h2>
            <p className="text-gray-600 mb-6 font-[AeonikArabic]">
              Spoonacular or OpenFoodFacts has stopped responding.  
              Support the project to keep data flowing ❤️
            </p>
            <a
              href="https://buymeacoffee.com/auvance"
              target="_blank"
              className="px-6 py-3 bg-[#009B3E] text-white rounded-full font-semibold hover:bg-[#007d32] font-[AeonikArabic]"
            >
              Support GrainFreeHub
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-[AeonikArabic]">
            {items.map((item) => {
              const title =
                item.title ||
                item.product_name ||
                item.code ||
                "Untitled";

              const image =
                item.image ||
                item.image_front_url ||
                "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

              const calories =
                item.nutrition?.nutrients?.find(
                  (n) => n.name === "Calories"
                )?.amount ||
                item.nutriments?.["energy-kcal"] ||
                0;

              const link =
                item.type === "meal"
                  ? `/meal?id=${item.id}`
                  : `/product?id=${item.code}`;

              return (
                <Link
                  href={link}
                  key={item.id || item.code}
                  className="block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg hover:scale-[1.01] transition transform"
                >
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <p className="text-xs uppercase text-gray-400 mb-1">
                      {item.type === "product" ? "Product" : "Meal"}
                    </p>

                    <h3 className="font-semibold text-lg truncate">{title}</h3>

                    {item.readyInMinutes && (
                      <p className="text-sm text-gray-500">
                        Ready in {item.readyInMinutes} min
                      </p>
                    )}

                    <span className="text-[#009B3E] font-medium">
                      {Math.round(calories)} kcal
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
