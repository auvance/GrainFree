"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// IMPORTANT: this should be your working modal component file
// e.g. src/components/features/BarcodeScannerModal.tsx
import BarcodeScannerModal from "@/components/features/BarcodeScannerModal";

type OFFProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  allergens_tags?: string[];
  nutriments?: {
    "energy-kcal"?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
};

function cleanTag(tag: string) {
  return tag.replace(/^en:/, "").replace(/-/g, " ");
}

function safeImg(p: OFFProduct) {
  return (
    p.image_front_url ||
    p.image_front_small_url ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
  );
}

function clamp(str: string, max = 56) {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

export default function ProductSearchPage() {
  const router = useRouter();
  const params = useSearchParams();

  // Optional: allow barcode arriving via query param
  // /product-search?barcode=123
  const barcodeFromUrl = params.get("barcode") || "";

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<OFFProduct[]>([]);
  const [count, setCount] = useState<number>(0);

  const [scannerOpen, setScannerOpen] = useState(false);

  // UX: simple filters that don't overcomplicate
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(true);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

  const activeQuery = query.trim() || "gluten-free";

  const badgeFilters = useMemo(
    () => [
      { key: "gluten", label: "Gluten Free", active: glutenFreeOnly },
      { key: "scan", label: "Scan Barcode", active: false },
    ],
    [glutenFreeOnly]
  );

  // ─────────────────────────────────────────────────────────────
  // Fetch products from OpenFoodFacts
  // ─────────────────────────────────────────────────────────────
  async function fetchProducts(searchTerms: string, pageNum: number) {
    setLoading(true);
    setError(null);

    try {
      const fields = [
        "code",
        "product_name",
        "brands",
        "image_front_small_url",
        "image_front_url",
        "allergens_tags",
        "nutriments",
      ].join(",");

      const base = new URL("https://world.openfoodfacts.org/cgi/search.pl");
      base.searchParams.set("search_terms", searchTerms);
      base.searchParams.set("json", "1");
      base.searchParams.set("page_size", String(pageSize));
      base.searchParams.set("page", String(pageNum));
      base.searchParams.set("fields", fields);

      // Keep your original constraint, but make it optional
      if (glutenFreeOnly) {
        base.searchParams.set("tagtype_0", "labels");
        base.searchParams.set("tag_contains_0", "contains");
        base.searchParams.set("tag_0", "gluten-free");
      }

      const res = await fetch(base.toString(), { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error("Failed to fetch products.");

      const data = await res.json();

      const list = (data.products || []) as OFFProduct[];
      setProducts(list);
      setCount(Number(data.count || 0));
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setProducts([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  // initial load
  useEffect(() => {
    fetchProducts(activeQuery, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, glutenFreeOnly]);

  // If barcode comes from URL, route to product details immediately
  useEffect(() => {
    if (!barcodeFromUrl) return;
    router.push(`/product?id=${encodeURIComponent(barcodeFromUrl)}`);
  }, [barcodeFromUrl, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProducts(activeQuery, 1);
  }

  // derived
  const hasResults = !loading && !error && products.length > 0;

  return (
    <main className="min-h-screen bg-[#FAFAF5] text-black">
      {/* Top soft gradient wash */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#009B3E]/10 via-[#3D4F46]/10 to-transparent blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#009B3E]/8 blur-3xl" />
      </div>

      {/* Header-ish container (page has no global header/footer by your choice) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.05] font-[AeonikArabic]">
              Product Search
              <span className="text-[#009B3E]">.</span>
            </h1>
            <p className="mt-2 text-gray-600 font-[AeonikArabic] max-w-2xl">
              Search packaged products from OpenFoodFacts — built for fast scanning + safe decisions.
            </p>
          </div>

          {/* Scan CTA (desktop aligned) */}
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="w-full sm:w-auto rounded-full border border-white/30 bg-white/55 backdrop-blur-md px-5 py-3 font-[AeonikArabic] font-semibold text-[#1E3B32] shadow-sm hover:bg-white/70 transition"
            >
              Scan barcode
            </button>
          </div>
        </div>

        {/* Search + controls */}
        <div className="mt-8 rounded-3xl border border-white/30 bg-white/55 backdrop-blur-xl shadow-sm">
          <div className="p-4 sm:p-5">
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3"
            >
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products (e.g., bread, cereal, granola bar)…"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-28 font-[AeonikArabic] text-sm outline-none focus:ring-2 focus:ring-[#009B3E]/35"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#1E3B32] hover:bg-black/5 transition"
                  >
                    Scan
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-[#1E3B32] px-5 py-3 font-[AeonikArabic] text-sm font-semibold text-white hover:bg-[#162d26] transition"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setGlutenFreeOnly((v) => !v)}
                className={`rounded-2xl px-5 py-3 font-[AeonikArabic] text-sm font-semibold border transition ${
                  glutenFreeOnly
                    ? "bg-[#009B3E]/10 text-[#1E3B32] border-[#009B3E]/25"
                    : "bg-white text-gray-700 border-black/10 hover:bg-black/5"
                }`}
                aria-pressed={glutenFreeOnly}
              >
                {glutenFreeOnly ? "Gluten-free: ON" : "Gluten-free: OFF"}
              </button>
            </form>

            {/* Quick chips row */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {badgeFilters.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => {
                    if (b.key === "gluten") setGlutenFreeOnly((v) => !v);
                    if (b.key === "scan") setScannerOpen(true);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold font-[AeonikArabic] border transition ${
                    b.key === "gluten" && glutenFreeOnly
                      ? "bg-[#009B3E]/10 text-[#1E3B32] border-[#009B3E]/25"
                      : "bg-white/70 border-black/10 text-gray-700 hover:bg-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-gray-500 font-[AeonikArabic]">
                Results: {count ? count.toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 pt-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
              >
                <div className="h-44 bg-black/5 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-24 bg-black/10 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-black/10 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-black/10 rounded animate-pulse" />
                  <div className="h-7 w-40 bg-black/10 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">
            <div className="text-lg font-semibold font-[AeonikArabic]">
              Could not fetch products
            </div>
            <div className="mt-1 text-sm font-[AeonikArabic] opacity-80">
              {error}
            </div>
            <button
              type="button"
              onClick={() => fetchProducts(activeQuery, page)}
              className="mt-4 rounded-2xl bg-[#1E3B32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#162d26] transition font-[AeonikArabic]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-black/10 bg-white/70 backdrop-blur-md p-10 text-center">
            <h2 className="text-2xl font-extrabold text-[#1E3B32] font-[AeonikArabic]">
              No results
            </h2>
            <p className="mt-2 text-gray-600 font-[AeonikArabic]">
              Try a broader keyword, or turn off the gluten-free constraint.
            </p>
          </div>
        )}

        {/* Grid */}
        {hasResults && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const calories = Math.round(p.nutriments?.["energy-kcal"] || 0);
                const allergens = (p.allergens_tags || []).map(cleanTag);

                return (
                  <Link
                    key={p.code}
                    href={`/product?id=${encodeURIComponent(p.code || "")}`}
                    className="group overflow-hidden rounded-3xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-[2px] transition"
                  >
                    <div className="relative h-44">
                      <Image
                        src={safeImg(p)}
                        alt={p.product_name || "Product image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          Product
                        </span>
                      </div>
                      <div className="absolute right-3 bottom-3">
                        <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#1E3B32] backdrop-blur-md border border-black/5">
                          {calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-gray-600 font-[AeonikArabic]">
                        {p.brands ? clamp(p.brands, 36) : "Unknown brand"}
                      </div>
                      <div className="mt-1 text-lg font-semibold leading-snug text-[#12241A] font-[AeonikArabic]">
                        {clamp(p.product_name || "Unnamed product", 64)}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {allergens.slice(0, 4).map((a) => (
                          <span
                            key={a}
                            className="rounded-full bg-[#EAF2EB] px-2 py-1 text-[0.7rem] text-gray-700"
                          >
                            {a}
                          </span>
                        ))}
                        {allergens.length === 0 && (
                          <span className="rounded-full bg-[#EAF2EB] px-2 py-1 text-[0.7rem] text-gray-500">
                            No allergens listed
                          </span>
                        )}
                        {allergens.length > 4 && (
                          <span className="rounded-full bg-[#EAF2EB] px-2 py-1 text-[0.7rem] text-gray-500">
                            +{allergens.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-[AeonikArabic]">
                          Open details
                        </span>
                        <span className="text-sm font-semibold text-[#009B3E] opacity-0 translate-x-[-4px] transition duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 font-[AeonikArabic]">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1E3B32] disabled:opacity-40 hover:bg-white transition font-[AeonikArabic]"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page >= totalPages}
                  className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1E3B32] disabled:opacity-40 hover:bg-white transition font-[AeonikArabic]"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Scanner modal (always mounted once) */}
      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={(barcode) => {
          // Keep your existing system behavior: route to product page
          router.push(`/product?id=${encodeURIComponent(barcode)}`);
        }}
        title="Scan product barcode"
      />
    </main>
  );
}
