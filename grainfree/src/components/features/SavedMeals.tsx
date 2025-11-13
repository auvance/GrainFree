"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

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

  // ─── Fetch user's saved meals ─────────────────────────────────────
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

  // ─── Remove Meal from Saved List ─────────────────────────────────
  const handleRemove = async (mealId: string) => {
    if (!confirm("Remove this meal from your saved list?")) return;

    try {
      const { error } = await supabase
        .from("saved_meals")
        .delete()
        .eq("id", mealId)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Update local UI
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
    } catch (err) {
      console.error("Error removing meal:", err);
      alert("Failed to remove this meal. Please try again.");
    }
  };

  // ─── Empty / Loading / Error states ───────────────────────────────
  if (!user) {
    return (
      <p className="text-gray-400 text-center">
        Please sign in to view your saved meals.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-gray-400 text-center">Loading saved meals...</p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center">
        Couldn’t load your saved meals. Please try again later.
      </p>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center text-gray-300 bg-white/5 border border-white/10 rounded-xl p-10">
        <h3 className="text-lg font-semibold mb-2">No saved meals yet</h3>
        <p className="text-gray-400">
          You can save meals from the Meal Details page to view them here later.
        </p>
      </div>
    );
  }

  // ─── Saved meals grid ─────────────────────────────────────────────
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Saved Meals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:shadow-lg transition relative"
          >
            {meal.image && (
              <Image
                src={meal.image}
                alt={meal.title}
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">
                {meal.title}
              </h3>

              {meal.calories && (
                <p className="text-sm text-gray-400 mb-2">
                  {Math.round(meal.calories)} kcal
                </p>
              )}

              <div className="flex justify-between items-center mt-2">
                <Link
                  href={`/meal?id=${meal.meal_id}`}
                  className="text-[#00B84A] text-sm font-medium hover:underline"
                >
                  View Details →
                </Link>

                <button
                  onClick={() => handleRemove(meal.id)}
                  className="text-sm text-red-400 hover:text-red-500 transition"
                >
                  Remove ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
