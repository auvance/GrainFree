"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type Meal = {
  id?: string;
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  time?: string;
  eaten_at?: string | null;
  completed?: boolean;
};

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

export default function MealTracker({
  meals = [],
  onMealAdded,
}: {
  meals?: Meal[];
  onMealAdded?: (m: Meal) => void;
}) {
  const { user } = useAuth();
  const mealTypes: Meal["type"][] = useMemo(
    () => ["Breakfast", "Lunch", "Dinner", "Snack"],
    []
  );

  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({});
  const [suggestions, setSuggestions] = useState<{ id: number; title: string; nutrition?: { nutrients?: { name: string; amount?: number }[] } }[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [saving, setSaving] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  // Suggestions (debounced)
  useEffect(() => {
    const q = (newMeal.name || "").trim();
    if (!q || q.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoadingSuggest(true);
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
            q
          )}&number=6&addRecipeNutrition=true&apiKey=${SPOONACULAR_KEY}`,
          { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Error fetching recipes", err);
      } finally {
        setLoadingSuggest(false);
      }
    };

    const t = setTimeout(fetchSuggestions, 350);
    return () => clearTimeout(t);
  }, [newMeal.name, SPOONACULAR_KEY]);

  const pendingMeals = useMemo(
    () => meals.filter((m) => !m.completed),
    [meals]
  );

  const resetForm = () => {
    setNewMeal({});
    setSuggestions([]);
    setShowForm(false);
  };

  const handleAddMeal = async () => {
    if (!user || !newMeal.name || !newMeal.type) return;

    setSaving(true);
    try {
      const mealToAdd = {
        name: newMeal.name,
        type: newMeal.type,
        calories: Number(newMeal.calories || 0),
        time: newMeal.time || null,
        user_id: user.id,
        completed: false,
        eaten_at: null,
      };

      const { data, error } = await supabase
        .from("completed_meals")
        .insert([mealToAdd])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return;
      }

      onMealAdded?.(data);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const markAsEaten = async (mealId: string) => {
    const { data, error } = await supabase
      .from("completed_meals")
      .update({ completed: true, eaten_at: new Date().toISOString() })
      .eq("id", mealId)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return;
    }

    onMealAdded?.(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              meal tracker
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.7rem] sm:text-[2.1rem] font-semibold leading-tight">
              Today’s Meals
            </h2>
            <p className="mt-2 font-[AeonikArabic] text-white/75 max-w-[62ch]">
              Add meals as “pending”, then mark them eaten to update your stats.
            </p>
          </div>

          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/8 px-5 py-3 font-[AeonikArabic] text-sm text-white hover:bg-white/12 transition"
          >
            {showForm ? "Close" : "Add Meal"}
          </button>
        </div>

        {/* Form */}
        {showForm ? (
          <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Meal name (e.g., quinoa salad)"
                  value={newMeal.name || ""}
                  onChange={(e) =>
                    setNewMeal((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/50"
                />

                {/* Suggestions */}
                {(loadingSuggest || suggestions.length > 0) && (
                  <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#1f2a24]/95 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
                    {loadingSuggest ? (
                      <div className="px-4 py-3 text-sm font-[AeonikArabic] text-white/70">
                        Searching…
                      </div>
                    ) : (
                      suggestions.map((s) => {
                        const kcal =
                          Math.round(
                            s.nutrition?.nutrients?.find((n: { name: string; amount?: number }) => n.name === "Calories")
                              ?.amount || 0
                          ) || 0;

                        return (
                          <button
                            type="button"
                            key={s.id}
                            onClick={() =>
                              setNewMeal((p) => ({
                                ...p,
                                name: s.title,
                                calories: kcal,
                              }))
                            }
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-[AeonikArabic] text-sm text-white">
                                {s.title}
                              </span>
                              <span className="font-[AeonikArabic] text-xs text-white/60">
                                {kcal ? `${kcal} kcal` : ""}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <select
                  value={newMeal.type || ""}
                  onChange={(e) =>
                    setNewMeal((p) => ({
                      ...p,
                      type: e.target.value as Meal["type"],
                    }))
                  }
                  className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/50"
                >
                  <option value="">Type</option>
                  {mealTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={newMeal.calories ?? ""}
                  onChange={(e) =>
                    setNewMeal((p) => ({ ...p, calories: Number(e.target.value) }))
                  }
                  className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/50"
                />
              </div>

              <div className="md:col-span-3">
                <input
                  type="time"
                  value={newMeal.time || ""}
                  onChange={(e) =>
                    setNewMeal((p) => ({ ...p, time: e.target.value }))
                  }
                  className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/50"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleAddMeal}
                disabled={saving || !newMeal.name || !newMeal.type}
                className={cn(
                  "rounded-xl px-5 py-2.5 font-[AeonikArabic] text-sm transition",
                  "border border-white/10",
                  saving || !newMeal.name || !newMeal.type
                    ? "bg-white/5 text-white/50 cursor-not-allowed"
                    : "bg-[#008509] hover:bg-green-700 text-white"
                )}
              >
                {saving ? "Adding…" : "Add Meal"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-xl px-5 py-2.5 font-[AeonikArabic] text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Meal columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {mealTypes.map((mealType) => {
          const logged = pendingMeals.filter((m) => m.type === mealType);

          return (
            <div
              key={mealType}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-5 sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-[AeonikArabic] text-lg sm:text-xl font-semibold">
                    {mealType}
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-[AeonikArabic] text-white/70">
                    {logged.length} pending
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {logged.length > 0 ? (
                    logged.map((meal) => (
                      <div
                        key={meal.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4"
                      >
                        <div>
                          <p className="font-[AeonikArabic] text-white">
                            {meal.name}
                          </p>
                          <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
                            {meal.calories ? `${meal.calories} kcal` : "Calories N/A"}
                            {meal.time ? ` • ${meal.time}` : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => markAsEaten(meal.id!)}
                          className="shrink-0 rounded-xl px-4 py-2 text-xs font-[AeonikArabic] bg-[#008509] hover:bg-green-700 transition"
                        >
                          Mark eaten
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="font-[AeonikArabic] text-white/60">
                      No {mealType.toLowerCase()} pending.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
