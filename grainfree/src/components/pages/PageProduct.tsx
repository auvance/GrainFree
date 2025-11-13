"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "../layout/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  // ─── Fetch Product from Open Food Facts ──────────────────────────────
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
          return;
        }
        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ─── Redirect on error ────────────────────────────────────────────────
  useEffect(() => {
    if (error || (!product && !loading && productId)) {
      const timeout = setTimeout(() => {
        router.back();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [error, product, loading, productId, router]);

  // ─── Save Product to Supabase ────────────────────────────────────────
  const handleSaveProduct = async () => {
    if (!user) {
      alert("Please sign in to save products.");
      return;
    }
    if (!product?.code) return;

    setSaving(true);
    try {
      // Prevent duplicates
      const { data: existing } = await supabase
        .from("saved_products")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_code", product.code)
        .maybeSingle();

      if (existing) {
        alert("You’ve already saved this product!");
        setSaved(true);
        setSaving(false);
        return;
      }

      const calories = product.nutriments?.["energy-kcal"] || null;

      const { data, error } = await supabase
        .from("saved_products")
        .insert([
          {
            user_id: user.id,
            product_code: product.code,
            product_name: product.product_name,
            image: product.image_front_url,
            calories: calories,
          },
        ])
        .select();

      if (error) throw error;

      console.log("Product saved:", data);
      setSaved(true);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save this product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading / Error States ──────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAF5] text-gray-700">
        <p>Loading product details...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF5] text-center px-6">
        <h2 className="text-2xl font-semibold text-[#009B3E] mb-3">
          Product not found
        </h2>
        <p className="text-gray-600 max-w-md mb-4">
          Redirecting you back to your meal…
        </p>
  
        <div className="mt-3 animate-spin rounded-full h-8 w-8 border-4 border-[#009B3E] border-t-transparent"></div>
      </main>
    );
  }

  // ─── Extract Nutrition + Allergens ───────────────────────────────────
  const { nutriments = {} } = product;
  const calories = nutriments["energy-kcal"] || 0;
  const protein = nutriments.proteins || 0;
  const carbs = nutriments.carbohydrates || 0;
  const fat = nutriments.fat || 0;

  const allergens =
    product.allergens_tags?.map((tag) =>
      tag.replace("en:", "").replace("-", " ")
    ) || [];

  // ─── Render UI ───────────────────────────────────────────────────────
  return (
  <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
    <Header/>
    
    <section className="py-10 px-6 md:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* LEFT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <Image
            src={
              product.image_front_url ||
              "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
            }
            alt={product.product_name}
            width={800}
            height={320}
            className="w-full h-80 object-cover"
          />

          <div className="p-8">
            <h1 className="text-3xl font-semibold italic mb-4">
              {product.product_name || "Unnamed Product"}
            </h1>

            <section className="mb-8">
              <h2 className="text-lg font-bold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.generic_name_en ||
                  "No detailed description available for this product."}
              </p>
            </section>

            {product.ingredients_text_en && (
              <section className="mb-8">
                <h2 className="text-lg font-bold mb-3">Ingredients</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.ingredients_text_en
                    .split(/[.,;]/)
                    .filter((i) => i.trim().length > 0)
                    .map((i, idx) => (
                      <li key={idx}>{i.trim()}</li>
                    ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-lg font-bold mb-3">Where to Find?</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {[
                  "Target",
                  "Costco",
                  "Canadian Superstore",
                  "Walmart",
                  "Local Grocery Stores",
                ].map((store) => (
                  <li key={store}>{store}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* RIGHT SECTION — FACTS PANEL */}
        <div className="bg-[#1E3B32] text-white rounded-2xl p-8 flex flex-col justify-between shadow-md">
          <div>
            <h2 className="text-2xl font-semibold italic mb-6 border-b border-white/20 pb-3">
              Facts
            </h2>

            <div className="mb-6">
              <p className="text-gray-300 text-sm uppercase mb-1">Price Range</p>
              <p className="text-xl font-bold">$4.02</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm uppercase mb-2">Allergen Info</p>
              <div className="flex flex-wrap gap-2">
                {allergens.length > 0 ? (
                  allergens.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#2C4D3C] rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    {["Gluten-Free", "Lacto-Free", "Nut-Free", "Vegan"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#2C4D3C] rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-300 text-sm uppercase mb-2">
                Nutrition Facts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2C4D3C] rounded-lg p-3 text-center">
                  <p className="font-semibold">{Math.round(calories)}</p>
                  <p className="text-sm text-gray-300">calories</p>
                </div>
                <div className="bg-[#2C4D3C] rounded-lg p-3 text-center">
                  <p className="font-semibold">{protein}g</p>
                  <p className="text-sm text-gray-300">protein</p>
                </div>
                <div className="bg-[#2C4D3C] rounded-lg p-3 text-center">
                  <p className="font-semibold">{carbs}g</p>
                  <p className="text-sm text-gray-300">carbs</p>
                </div>
                <div className="bg-[#2C4D3C] rounded-lg p-3 text-center">
                  <p className="font-semibold">{fat}g</p>
                  <p className="text-sm text-gray-300">fats</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSaveProduct}
              disabled={saving || saved}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                saved
                  ? "bg-green-700 cursor-not-allowed"
                  : "bg-[#009B3E] hover:bg-[#007d32]"
              }`}
            >
              {saved ? "Saved ✓" : saving ? "Saving..." : "Save to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}
