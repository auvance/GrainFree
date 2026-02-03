"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "../layout/Header/Header";
import Image from "next/image";

type Product = {
  code: string;
  product_name: string;
  image_front_url?: string;
  generic_name_en?: string;
  brands?: string;
  ingredients_text_en?: string;
  allergens_tags?: string[];
  nutriments?: {
    "energy-kcal"?: number;
    proteins?: number;
    carbohydrates?: number;
    fat?: number;
  };
};

function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

export default function PageProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "overview" | "ingredients" | "stores"
  >("overview");

  // ─────────────────────────────────────────────────────────────
  // FETCH PRODUCT
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${productId}.json`,
          { next: { revalidate: 3600 } }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        if (!data?.product) {
          setError(true);
          setProduct(null);
          return;
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ─────────────────────────────────────────────────────────────
  // REDIRECT ON ERROR (back to last page)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (error || (!product && !loading && productId)) {
      const timeout = setTimeout(() => {
        router.back();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [error, product, loading, productId, router]);

  // ─────────────────────────────────────────────────────────────
  // DERIVED DATA (must be before early returns to follow Rules of Hooks)
  // ─────────────────────────────────────────────────────────────
  const ingredientsList = useMemo(() => {
    const raw = product?.ingredients_text_en || "";
    return raw
      .split(/[.,;]/)
      .map((i) => i.trim())
      .filter(Boolean);
  }, [product?.ingredients_text_en]);

  const whereToFind = useMemo(
    () => [
      "Target",
      "Costco",
      "Canadian Superstore",
      "Walmart",
      "Local Grocery Stores",
    ],
    []
  );

  // ─────────────────────────────────────────────────────────────
  // SAVE PRODUCT TO SUPABASE
  // ─────────────────────────────────────────────────────────────
  const handleSaveProduct = async () => {
    if (!user) return alert("Please sign in to save products.");
    if (!product?.code) return;

    setSaving(true);

    try {
      const { data: existing } = await supabase
        .from("saved_products")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_code", product.code)
        .maybeSingle();

      if (existing) {
        setSaved(true);
        return;
      }

      const calories = product.nutriments?.["energy-kcal"] || null;

      const { error: insertError } = await supabase
        .from("saved_products")
        .insert([
          {
            user_id: user.id,
            product_code: product.code,
            product_name: product.product_name,
            image: product.image_front_url,
            calories,
          },
        ]);

      if (insertError) throw insertError;

      setSaved(true);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save this product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-14">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8">
            <div className="rounded-3xl bg-white/60 h-[520px]" />
            <div className="rounded-3xl bg-[#1E3B32]/30 h-[520px]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#EAF2EB] text-center px-6">
        <h2 className="text-2xl font-semibold text-[#009B3E] mb-3">
          Product not found
        </h2>
        <p className="text-gray-700 max-w-md mb-4">
          Redirecting you back…
        </p>
        <div className="mt-3 animate-spin rounded-full h-8 w-8 border-4 border-[#009B3E] border-t-transparent" />
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DERIVED DATA
  // ─────────────────────────────────────────────────────────────
  const nutriments = product.nutriments || {};
  const calories = nutriments["energy-kcal"] || 0;
  const protein = nutriments.proteins || 0;
  const carbs = nutriments.carbohydrates || 0;
  const fat = nutriments.fat || 0;

  const allergens =
    product.allergens_tags?.map((tag) =>
      tag.replace("en:", "").replace("-", " ")
    ) || [];

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
      <Header />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pt-10">
        <div className="flex items-start justify-between gap-6 font-[AeonikArabic]">
          <div className="min-w-0">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#1E3B32] hover:text-[#009B3E] transition"
            >
              <span className="text-lg">←</span>
              Back
            </button>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
              {product.product_name || "Unnamed Product"}
            </h1>

            {product.brands && (
              <p className="mt-2 text-sm text-gray-600">
                Brand: <span className="font-medium">{product.brands}</span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition",
                  activeTab === "overview"
                    ? "bg-[#1E3B32] text-white border-transparent"
                    : "bg-white/70 border-black/10 hover:bg-white"
                )}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab("ingredients")}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition",
                  activeTab === "ingredients"
                    ? "bg-[#1E3B32] text-white border-transparent"
                    : "bg-white/70 border-black/10 hover:bg-white"
                )}
              >
                Ingredients ({ingredientsList.length})
              </button>

              <button
                onClick={() => setActiveTab("stores")}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition",
                  activeTab === "stores"
                    ? "bg-[#1E3B32] text-white border-transparent"
                    : "bg-white/70 border-black/10 hover:bg-white"
                )}
              >
                Where to find
              </button>
            </div>
          </div>

          {/* Desktop quick action */}
          <div className="hidden lg:flex items-center gap-3 font-[AeonikArabic]">
            <button
              onClick={handleSaveProduct}
              disabled={saving || saved}
              className={classNames(
                "px-5 py-3 rounded-full font-semibold transition shadow-sm",
                saved
                  ? "bg-green-700 text-white cursor-not-allowed"
                  : "bg-[#009B3E] text-white hover:bg-[#007d32]"
              )}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-10 font-[AeonikArabic]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Image card */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-black/5">
              <div className="relative w-full h-[240px] md:h-[360px]">
                <Image
                  src={
                    product.image_front_url ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={product.product_name || "Product image"}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Tab panels */}
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {activeTab === "overview"
                    ? "Overview"
                    : activeTab === "ingredients"
                    ? "Ingredients"
                    : "Where to Find"}
                </h2>

                <span className="text-xs text-gray-500">
                  Tap chips above to switch
                </span>
              </div>

              <div className="px-6 md:px-8 py-6">
                {/* OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {product.generic_name_en ||
                        "No detailed description available for this product."}
                    </p>

                    {/* quick highlights */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="rounded-2xl bg-[#F4F6F4] border border-black/5 p-4">
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="text-xl font-semibold">
                          {Math.round(calories)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F4F6F4] border border-black/5 p-4">
                        <p className="text-xs text-gray-500">Protein</p>
                        <p className="text-xl font-semibold">
                          {Math.round(protein)}g
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F4F6F4] border border-black/5 p-4">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="text-xl font-semibold">
                          {Math.round(carbs)}g
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F4F6F4] border border-black/5 p-4">
                        <p className="text-xs text-gray-500">Fat</p>
                        <p className="text-xl font-semibold">
                          {Math.round(fat)}g
                        </p>
                      </div>
                    </div>

                    {/* allergens preview */}
                    <div className="mt-6">
                      <p className="text-sm font-semibold mb-2">
                        Allergen info
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {allergens.length > 0 ? (
                          allergens.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-[#1E3B32] text-white text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-600 italic">
                            No allergen tags provided for this product.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* INGREDIENTS */}
                {activeTab === "ingredients" && (
                  <>
                    {ingredientsList.length === 0 ? (
                      <p className="text-gray-600 italic">
                        No ingredient list available for this product.
                      </p>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ingredientsList.map((ing, idx) => (
                          <li
                            key={`${ing}-${idx}`}
                            className="rounded-2xl border border-black/5 bg-[#F4F6F4] p-4 text-gray-800"
                          >
                            {ing}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                {/* STORES */}
                {activeTab === "stores" && (
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      Suggested retailers (placeholder list — you can later map
                      these to real local stores):
                    </p>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {whereToFind.map((store) => (
                        <li
                          key={store}
                          className="rounded-2xl border border-black/5 bg-[#F4F6F4] p-4 text-gray-800"
                        >
                          {store}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT (Sticky facts) */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl bg-[#101614] text-white border border-white/10 shadow-sm overflow-hidden">
              <div className="px-6 py-6 border-b border-white/10">
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  Nutrition
                </p>
                <h3 className="text-xl font-semibold mt-1">Facts</h3>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/60">Calories</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(calories)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/60">Protein</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(protein)}g
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/60">Carbs</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(carbs)}g
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs text-white/60">Fat</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(fat)}g
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="space-y-3">
                  <button
                    onClick={handleSaveProduct}
                    disabled={saving || saved}
                    className={classNames(
                      "w-full py-3 rounded-2xl font-semibold transition",
                      saved
                        ? "bg-green-700 cursor-not-allowed"
                        : "bg-[#009B3E] hover:bg-[#007d32]"
                    )}
                  >
                    {saved ? "Saved ✓" : saving ? "Saving…" : "Save to Dashboard"}
                  </button>

                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className="w-full py-3 rounded-2xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    View ingredients
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white/60 border border-black/5 p-5 text-sm text-gray-700">
              Tip: If you’re coming from a recipe, use{" "}
              <span className="font-semibold">Back</span> to return quickly.
            </div>
          </aside>
        </div>
      </section>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-black/10 shadow-lg p-3 flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="font-semibold truncate">
                {Math.round(calories)} kcal • {Math.round(protein)}g protein
              </p>
            </div>

            <button
              onClick={handleSaveProduct}
              disabled={saving || saved}
              className={classNames(
                "ml-auto px-4 py-3 rounded-xl font-semibold transition shrink-0",
                saved
                  ? "bg-green-700 text-white cursor-not-allowed"
                  : "bg-[#009B3E] text-white hover:bg-[#007d32]"
              )}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden h-24" />
    </main>
  );
}
