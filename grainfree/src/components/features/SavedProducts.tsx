"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

type SavedProduct = {
  id: string;
  product_code: string;
  product_name: string;
  image?: string;
  calories?: number;
  created_at?: string;
};

export default function SavedProducts() {
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

  const handleRemove = async (id: string) => {
    const { error } = await supabase
      .from("saved_products")
      .delete()
      .eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!user) {
    return <p className="text-gray-300">Please sign in to see saved products.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Saved Products</h2>
      {loading ? (
        <p className="text-gray-300">Loading your products…</p>
      ) : products.length === 0 ? (
        <p className="text-gray-300">
          You haven&apos;t saved any products yet. Save one from the Product page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4 items-center"
            >
              <div className="w-20 h-20 relative rounded-md overflow-hidden bg-black/20">
                <Image
                  src={
                    p.image ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={p.product_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  {p.product_name}
                </h3>
                <p className="text-sm text-gray-300">
                  {p.calories ? `${Math.round(p.calories)} kcal` : "Calories N/A"}
                </p>
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-sm text-red-400 hover:text-red-500"
              >
                Remove ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
