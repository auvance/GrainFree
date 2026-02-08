"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type SavedProduct = {
  id: string;
  product_code: string;
  product_name: string;
  image?: string;
  calories?: number;
  created_at?: string;
};

export default function SafeProductLibrary({
  variant = "full",
  limit = 6,
}: {
  variant?: "full" | "preview";
  limit?: number;
}) {
  const { user } = useAuth();
  const [products, setProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const isPreview = variant === "preview";

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      setLoading(true);

      let q = supabase
        .from("saved_products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (isPreview) q = q.limit(limit);

      const { data, error } = await q;
      if (!error && data) setProducts(data as SavedProduct[]);
      setLoading(false);
    };

    fetchProducts();
  }, [user, isPreview, limit]);

  if (!user) {
    return (
      <p className="font-[AeonikArabic] text-white/70 text-center">
        Please sign in to see saved products.
      </p>
    );
  }

  if (isPreview) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                library
              </p>
              <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
                Your safe products
              </h3>
            </div>

            <Link
              href="/dash?view=saved-products"
              className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="mt-4 font-[AeonikArabic] text-sm text-white/70">Loading…</p>
          ) : products.length === 0 ? (
            <p className="mt-4 font-[AeonikArabic] text-sm text-white/70">
              No saved products yet — save products to build your safe list.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {products.slice(0, limit).map((p) => (
                <Link
                  key={p.id}
                  href={`/product?id=${p.product_code}`}
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition overflow-hidden"
                >
                  <div className="relative h-20 w-full">
                    <Image
                      src={
                        p.image ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                      }
                      alt={p.product_name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-[AeonikArabic] text-xs text-white font-semibold line-clamp-2">
                      {p.product_name}
                    </p>
                    <p className="mt-1 font-[AeonikArabic] text-[11px] text-white/60">
                      {p.calories ? `${Math.round(p.calories)} kcal` : "Calories N/A"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // full mode – keep your existing UI if you want
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
        <div className="relative">
          <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
            library
          </p>
          <h2 className="mt-2 font-[AeonikArabic] text-[1.7rem] sm:text-[2.0rem] font-semibold">
            Saved Products
          </h2>
          <p className="mt-2 font-[AeonikArabic] text-white/75">
            Your trusted products — quick access, no re-searching.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="font-[AeonikArabic] text-white/70 text-center">
          Loading your products…
        </p>
      ) : products.length === 0 ? (
        <div className="text-center rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-10">
          <p className="font-[AeonikArabic] text-white/80 font-semibold">
            No saved products yet
          </p>
          <p className="mt-2 font-[AeonikArabic] text-white/70">
            Save a product from the Product page to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product?id=${p.product_code}`}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-5 hover:bg-white/5 transition"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
              <div className="relative flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <Image
                    src={
                      p.image ||
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                    alt={p.product_name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-[AeonikArabic] text-white font-semibold truncate">
                    {p.product_name}
                  </p>
                  <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
                    {p.calories ? `${Math.round(p.calories)} kcal` : "Calories N/A"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
