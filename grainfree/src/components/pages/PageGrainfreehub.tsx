"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BarcodeScannerModal from "@/components/features/BarcodeScannerModal";

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

function clampText(str: string, max = 58) {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

function getCalories(item: Item) {
  const fromMeal =
    item.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount ?? 0;
  const fromProduct = item.nutriments?.["energy-kcal"] ?? 0;
  return Math.round(fromMeal || fromProduct || 0);
}

function getImage(item: Item) {
  return (
    item.image ||
    item.image_front_url ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
  );
}

function getTitle(item: Item) {
  return item.title || item.product_name || item.code || "Untitled";
}

export default function PageGrainfreehub() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [source, setSource] = useState<"meals" | "products">("meals");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);

  const router = useRouter();
  const [scannerOpen, setScannerOpen] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  const filters = useMemo(
    () => [
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
    ],
    []
  );

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
        (data.results || []).map((r: Record<string, unknown>) => ({
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
        next: { revalidate: 3600 }, // cache for 1 hour
      });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      setItems(
        (data.products || []).map((p: Record<string, unknown>) => ({
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
    if (source === "products") fetchProducts(query);
    else fetchRecipes(query, filter);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (source === "meals") fetchRecipes(query, value);
  };

  // ────────────────────────────────────────────────────────────
  // Load initial data
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (source === "products") fetchProducts();
    else fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <main className="min-h-screen bg-[#FAFAF5] text-black">
      <Header />

      {/* HERO */}
      <section className="text-center py-10 sm:py-14 lg:py-16 px-4">
        <h1 className="text-[2.8rem] sm:text-[4.2rem] lg:text-[5.5rem] font-extrabold leading-[0.95]">
          <span className="text-[#3D4F46] font-[AeonikArabic]">Grain</span>
          <span className="text-[#009B3E] font-[AeonikArabic]">FreeHub</span>
        </h1>

        <p className="mt-4 text-[1rem] sm:text-[1.2rem] lg:text-[1.5rem] font-[AeonikArabic] font-bold text-gray-600 max-w-3xl mx-auto">
          Search, filter and find what works for you - meals, snacks and
          everything in between.
        </p>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="
            mt-8 sm:mt-10
            w-full
            max-w-3xl
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-[1fr_auto_auto_auto]
            gap-3
            font-[AeonikArabic]
          "
        >
          <input
            type="text"
            placeholder="Search foods, meals, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full
              rounded-full
              px-5 sm:px-6
              py-3
              border border-gray-300
              focus:outline-none
              focus:ring-2 focus:ring-[#009B3E]
              bg-white
            "
          />

          {/* Source Toggle */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as "meals" | "products")}
            className="
              w-full sm:w-auto
              rounded-full
              border border-gray-300
              px-4
              py-3
              bg-white
            "
          >
            <option value="meals">Meals</option>
            <option value="products">Products</option>
          </select>

          {/* Filters (Meals only) */}
          <select
            value={filter}
            disabled={source === "products"}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="
              w-full sm:w-auto
              rounded-full
              border border-gray-300
              px-4
              py-3
              bg-white
              disabled:opacity-40
            "
          >
            {filters.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          {/* Scan Barcode */}
          <button
            type="button"
            onClick={() => {
              if (source !== "products") {
                setSource("products");
                setScannerOpen(true);
                return;
              }
              setScannerOpen(true);
            }}
            className="
              w-full sm:w-auto
              rounded-full
              border border-gray-300
              px-4
              py-3
              bg-white
              text-[#12241A]
              font-semibold
              hover:bg-gray-50
              transition
            "
          >
            Scan
          </button>
        </form>
      </section>

      {/* Scanner Modal (place once, anywhere inside main) */}
      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={(barcode) => {
          router.push(`/product?id=${encodeURIComponent(barcode)}`);
        }}
        title="Scan product barcode"
      />

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <div className="h-44 bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="text-center py-14 sm:py-20 bg-white rounded-2xl border border-gray-200 px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#009B3E] mb-3 font-[AeonikArabic]">
              API Limit Reached
            </h2>
            <p className="text-gray-600 mb-6 font-[AeonikArabic] max-w-xl mx-auto">
              Spoonacular or OpenFoodFacts has stopped responding. Support the
              project to keep data flowing ❤️
            </p>
            <a
              href="https://buymeacoffee.com/auvance"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#009B3E] text-white rounded-full font-semibold hover:bg-[#007d32] transition font-[AeonikArabic]"
              rel="noreferrer"
            >
              Support GrainFreeHub
            </a>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-200 px-6">
            <h2 className="text-2xl font-bold text-[#3D4F46] font-[AeonikArabic]">
              No results
            </h2>
            <p className="mt-2 text-gray-600 font-[AeonikArabic]">
              Try a different keyword or broaden your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 font-[AeonikArabic]">
            {items.map((item) => {
              const title = getTitle(item);
              const image = getImage(item);
              const calories = getCalories(item);

              const link =
                item.type === "meal"
                  ? `/meal?id=${item.id}`
                  : `/product?id=${item.code}`;

              return (
                <Link
                  href={link}
                  key={item.id || item.code}
                  className="
                    group
                    block
                    bg-white
                    rounded-2xl
                    border border-gray-200
                    overflow-hidden
                    shadow-sm
                    transition
                    hover:shadow-xl
                    hover:-translate-y-[2px]
                  "
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="
                        object-cover
                        transition-transform duration-500
                        group-hover:scale-[1.04]
                      "
                    />

                    {/* Top-left pill */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs font-semibold
                          backdrop-blur-md
                          ${
                            item.type === "product"
                              ? "bg-black/70 text-white"
                              : "bg-[#009B3E]/90 text-white"
                          }
                        `}
                      >
                        {item.type === "product" ? "Product" : "Meal"}
                      </span>
                    </div>

                    {/* Bottom-right calories */}
                    <div className="absolute right-3 bottom-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#12241A] border border-black/5">
                        {calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[1.05rem] leading-snug text-[#12241A]">
                      {clampText(title, 62)}
                    </h3>

                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      {item.readyInMinutes ? (
                        <span>Ready in {item.readyInMinutes} min</span>
                      ) : (
                        <span className="italic">
                          {item.type === "product"
                            ? "Food database item"
                            : "Recipe result"}
                        </span>
                      )}

                      <span className="text-[#009B3E] font-medium opacity-0 translate-x-[-4px] transition duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        View →
                      </span>
                    </div>
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
