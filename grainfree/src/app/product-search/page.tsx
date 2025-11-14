"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type OFFProduct = {
  code: string;
  product_name: string;
  brands?: string;
  image_front_small_url?: string;
  allergens_tags?: string[];
  nutriments?: {
    "energy-kcal"?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
};

type FilterKey = "glutenFree" | "nutFree" | "dairyFree";

function similarityScore(query: string, target: string, brand?: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const t = target.toLowerCase();
  const b = brand?.toLowerCase() || "";

  // Simple token overlap
  const qTokens = q.split(/\s+/).filter(Boolean);
  const tTokens = (t + " " + b).split(/\s+/).filter(Boolean);

  const matches = qTokens.filter((qt) =>
    tTokens.some((tt) => tt.includes(qt) || qt.includes(tt))
  ).length;

  const baseScore = matches / qTokens.length;

  // bonus if brand includes query or vice versa
  const brandBoost = b.includes(q) || q.includes(b) ? 0.15 : 0;

  return Math.min(1, baseScore + brandBoost);
}

export default function ProductSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("name") || "";
  const [products, setProducts] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<FilterKey[]>([]);
  const [autoRedirecting, setAutoRedirecting] = useState(false);

  const pageSize = 12;

  // Fetch products when query or page changes
  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      setAutoRedirecting(false);

      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query
        )}&json=1&page_size=${pageSize}&page=${page}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to search");

        const data = await res.json();
        const prods: OFFProduct[] = data.products || [];
        setTotalProducts(data.count || prods.length);

        // Rank by fuzzy similarity
        const ranked = [...prods]
          .map((p) => ({
            ...p,
            _score: similarityScore(
              query,
              p.product_name || "",
              p.brands || ""
            ),
          }))
          .sort((a, b) => (b._score ?? 0) - (a._score ?? 0));

        setProducts(ranked);

        // Auto-redirect if top match very strong
        const best = ranked[0];
        if (best && (best as any)._score >= 0.9) {
          setAutoRedirecting(true);
          setTimeout(
            () => router.push(`/product?id=${best.code}`),
            800
          );
        }
      } catch (err) {
        console.error("Search error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page, router]);

  // Derived: filtered by allergen filters
  const filteredProducts = useMemo(() => {
    if (!selectedFilters.length) return products;

    return products.filter((p) => {
      const tags = p.allergens_tags || [];
      const has = (needle: string) =>
        tags.some((t) => t.toLowerCase().includes(needle));

      // glutenFree = exclude gluten
      if (selectedFilters.includes("glutenFree") && has("gluten")) {
        return false;
      }

      // nutFree = exclude nuts/peanuts
      if (
        selectedFilters.includes("nutFree") &&
        (has("nut") || has("peanut"))
      ) {
        return false;
      }

      // dairyFree = exclude milk/lactose
      if (
        selectedFilters.includes("dairyFree") &&
        (has("milk") || has("lactose"))
      ) {
        return false;
      }

      return true;
    });
  }, [products, selectedFilters]);

  const toggleFilter = (key: FilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  return (
    <main className="min-h-screen bg-[#FAFAF5] text-black py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8">
        {/* SIDEBAR */}
        <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit">
          <h2 className="text-lg font-semibold mb-3">Filters</h2>
          <p className="text-sm text-gray-500 mb-4">
            Refine packaged products that match your allergy needs.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFilters.includes("glutenFree")}
                onChange={() => toggleFilter("glutenFree")}
              />
              Gluten-free (hide gluten)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFilters.includes("nutFree")}
                onChange={() => toggleFilter("nutFree")}
              />
              Nut-free (hide nuts/peanuts)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFilters.includes("dairyFree")}
                onChange={() => toggleFilter("dairyFree")}
              />
              Dairy-free (hide milk)
            </label>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold mb-2">
              Scan a barcode (beta)
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Scan a barcode to jump directly to a product when supported.
            </p>
            {/* Barcode scanner placeholder / hook */}
            <BarcodeScanner
              onDetected={(code) => router.push(`/product?id=${code}`)}
            />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section>
          <h1 className="text-3xl font-bold mb-2">
            Products for{" "}
            <span className="text-[#009B3E]">“{query}”</span>
          </h1>
          {autoRedirecting && (
            <p className="text-sm text-gray-500 mb-3">
              Found a very close match. Redirecting to product details…
            </p>
          )}

          {loading && (
            <div className="text-center text-gray-500 mt-16">
              Searching…
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 mt-16">
              Could not fetch products. Try again later.
            </p>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-16">
              No matching packaged products found.
            </p>
          )}

          {/* GRID */}
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredProducts.map((p) => {
                  const calories =
                    p.nutriments?.["energy-kcal"] || 0;
                  const allergens =
                    p.allergens_tags?.map((tag) =>
                      tag.replace(/^en:/, "").replace(/-/g, " ")
                    ) || [];

                  return (
                    <Link
                      key={p.code}
                      href={`/product?id=${p.code}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition cursor-pointer overflow-hidden"
                    >
                      <img
                        src={
                          p.image_front_small_url ||
                          "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                        }
                        alt={p.product_name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {p.product_name || "Unnamed Product"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">
                          {p.brands || "Unknown Brand"}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#009B3E] font-medium">
                            {Math.round(calories)} kcal
                          </span>
                        </div>

                        {/* Allergen badges */}
                        <div className="flex flex-wrap gap-1">
                          {allergens.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="px-2 py-0.5 rounded-full bg-[#EAF2EB] text-[0.7rem] text-gray-700"
                            >
                              {a}
                            </span>
                          ))}
                          {allergens.length === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#EAF2EB] text-[0.7rem] text-gray-500">
                              No allergens listed
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full border text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => (p < totalPages ? p + 1 : p))
                  }
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-full border text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/**
 * BarcodeScanner component (camera integration placeholder).
 * To fully enable:
 *   pnpm add @zxing/browser
 * and wire up BrowserMultiFormatReader inside this component.
 */
function BarcodeScanner({
  onDetected,
}: {
  onDetected: (code: string) => void;
}) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      setSupported(true);
    }
  }, []);

  const handleClick = () => {
    if (!supported) {
      alert("Camera access is not supported in this browser.");
      return;
    }
    alert(
      "Barcode scanning setup placeholder. Install @zxing/browser and wire decoding logic here."
    );
    // After decoding:
    // onDetected(decodedText);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full px-4 py-2 rounded-lg bg-[#223528] text-white text-sm hover:bg-[#1a2922]"
    >
      Open barcode scanner
    </button>
  );
}
