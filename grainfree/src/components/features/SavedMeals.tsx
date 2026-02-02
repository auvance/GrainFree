"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type SavedMeal = {
  id: string;
  meal_id: number;
  title: string;
  image?: string;
  calories?: number;
  created_at?: string;
};

export default function SavedMeals() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSavedMeals = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data, error } = await supabase
          .from("saved_meals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMeals(data || []);
      } catch (err) {
        console.error("Error fetching saved meals:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMeals();
  }, [user]);

  const handleRemove = async (mealId: string) => {
    if (!confirm("Remove this meal from your saved list?")) return;

    try {
      const { error } = await supabase
        .from("saved_meals")
        .delete()
        .eq("id", mealId)
        .eq("user_id", user?.id);

      if (error) throw error;
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
    } catch (err) {
      console.error("Error removing meal:", err);
      alert("Failed to remove this meal. Please try again.");
    }
  };

  if (!user) {
    return (
      <p className="font-[AeonikArabic] text-white/70 text-center">
        Please sign in to view your saved meals.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="font-[AeonikArabic] text-white/70 text-center">
        Loading saved meals…
      </p>
    );
  }

  if (error) {
    return (
      <p className="font-[AeonikArabic] text-red-300 text-center">
        Couldn’t load your saved meals. Please try again later.
      </p>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-10">
        <h3 className="font-[AeonikArabic] text-lg font-semibold mb-2">
          No saved meals yet
        </h3>
        <p className="font-[AeonikArabic] text-white/70">
          Save meals from the Meal page to build your safe list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
        <div className="relative">
          <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
            library
          </p>
          <h2 className="mt-2 font-[AeonikArabic] text-[1.7rem] sm:text-[2.0rem] font-semibold">
            Saved Meals
          </h2>
          <p className="mt-2 font-[AeonikArabic] text-white/75">
            Your trusted meals — one tap away.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />

            <div className="relative">
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={
                    meal.image ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={meal.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              </div>

              <div className="p-5">
                <p className="font-[AeonikArabic] text-white font-semibold truncate">
                  {meal.title}
                </p>

                <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
                  {meal.calories ? `${Math.round(meal.calories)} kcal` : "Calories N/A"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/meal?id=${meal.meal_id}`}
                    className="rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-xs font-[AeonikArabic] hover:bg-white/12 transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleRemove(meal.id)}
                    className="text-xs font-[AeonikArabic] text-red-200 hover:text-red-100 transition"
                  >
                    Remove ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
