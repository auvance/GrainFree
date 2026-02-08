"use client";

import { useEffect, useMemo, useState } from "react";
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
  verdict_level?: "safe" | "caution" | "unsafe";
};

function verdictPill(level?: string) {
  if (level === "safe") return "border-[#00B84A]/25 bg-[#00B84A]/15 text-white";
  if (level === "caution") return "border-amber-300/25 bg-amber-400/15 text-white";
  if (level === "unsafe") return "border-red-400/25 bg-red-500/15 text-white";
  return "border-white/12 bg-white/5 text-white/80";
}

export default function SafeProductLibrary({
  variant = "preview",
  limit = 6,
  onViewAll,
}: {
  variant?: "preview" | "full";
  limit?: number;
  onViewAll?: () => void;
}) {
  const { user } = useAuth();
  const [products, setProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("saved_products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setProducts(data as SavedProduct[]);
      setLoading(false);
    };

    fetchProducts();
  }, [user]);

  const shown = useMemo(() => {
    if (variant === "full") return products;
    return products.slice(0, limit);
  }, [products, limit, variant]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1B2C25] via-[#16231E] to-[#101915] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_20%,rgba(157,231,197,0.16),transparent_55%)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
              library
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              Safe products
            </h3>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              Your trusted products — no re-searching.
            </p>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
            >
              View all
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mt-5">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 font-[AeonikArabic] text-sm text-white/75">
              Loading…
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-[AeonikArabic] text-sm text-white/80">
                No saved products yet.
              </p>
              <p className="mt-1 font-[AeonikArabic] text-xs text-white/60">
                Save a product after scanning to keep it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shown.map((p) => (
                <Link
                  key={p.id}
                  href={`/product?id=${p.product_code}`}
                  className="block rounded-2xl border border-white/10 bg-black/15 p-4 hover:bg-black/20 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <Image
                        src={
                          p.image ||
                          "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                        }
                        alt={p.product_name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-[AeonikArabic] text-sm font-medium text-white/90 line-clamp-2">
                          {p.product_name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-[AeonikArabic] ${verdictPill(
                            p.verdict_level
                          )}`}
                        >
                          {p.verdict_level ?? "saved"}
                        </span>
                      </div>

                      <p className="mt-2 font-[AeonikArabic] text-xs text-white/60">
                        Tap to view details
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
