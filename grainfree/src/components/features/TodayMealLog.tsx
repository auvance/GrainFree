"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

export type Meal = {
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

// Keep this identical in TodaysStats too
const CARD_HEIGHT = "min-h-[720px] lg:min-h-[760px]";

export default function TodayMealLog({
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
  const [suggestions, setSuggestions] = useState<
    {
      id: number;
      title: string;
      nutrition?: { nutrients?: { name: string; amount?: number }[] };
    }[]
  >([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [saving, setSaving] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

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

  const pendingMeals = useMemo(() => meals.filter((m) => !m.completed), [meals]);

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
    <section
      className={cn(
        "relative h-full overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#2F5A47] via-[#284338] to-[#1B2C26]",
        CARD_HEIGHT
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_25%_15%,rgba(157,231,197,0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_75%_70%,rgba(0,184,74,0.18),transparent_60%)]" />

      {/* Make inner layout stretch to fill height */}
      <div className="relative h-full p-5 sm:p-7 flex flex-col">
        {/* Header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/70">
              today
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.6rem] sm:text-[1.9rem] font-semibold leading-tight">
              Today’s meals
            </h2>
            <p className="mt-2 font-[AeonikArabic] text-sm text-white/75 max-w-[64ch]">
              Add meals as pending, then mark them eaten to update your stats.
            </p>
          </div>

          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-black/20 px-5 py-3 font-[AeonikArabic] text-sm text-white hover:bg-white/10 transition"
            type="button"
          >
            {showForm ? "Close" : "Add meal"}
          </button>
        </div>

        {/* Form */}
        {showForm ? (
          <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Meal name (e.g., quinoa salad)"
                  value={newMeal.name || ""}
                  onChange={(e) => setNewMeal((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/40"
                />

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
                            s.nutrition?.nutrients?.find(
                              (n: { name: string; amount?: number }) => n.name === "Calories"
                            )?.amount || 0
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
                  className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/40"
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
                    setNewMeal((p) => ({
                      ...p,
                      calories: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/40"
                />
              </div>

              <div className="md:col-span-3">
                <input
                  type="time"
                  value={newMeal.time || ""}
                  onChange={(e) => setNewMeal((p) => ({ ...p, time: e.target.value }))}
                  className="w-full rounded-xl bg-black/25 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none focus:ring-2 focus:ring-[#9DE7C5]/40"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleAddMeal}
                disabled={saving || !newMeal.name || !newMeal.type}
                className={cn(
                  "rounded-xl px-5 py-2.5 font-[AeonikArabic] text-sm transition border border-white/10",
                  saving || !newMeal.name || !newMeal.type
                    ? "bg-white/5 text-white/50 cursor-not-allowed"
                    : "bg-[#00B84A] hover:bg-green-700 text-white"
                )}
                type="button"
              >
                {saving ? "Adding…" : "Add meal"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-xl px-5 py-2.5 font-[AeonikArabic] text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* This area expands naturally; NO internal scrolling */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-1">
          {mealTypes.map((mealType) => {
            const logged = pendingMeals.filter((m) => m.type === mealType);

            return (
              <div
                key={mealType}
                className="flex flex-col items-start rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5"
              >
                <div className="flex flex-col items-left gap-3 lg:flex items-center justify-between">
                  <h3 className="font-[AeonikArabic] text-base sm:text-lg font-semibold">
                    {mealType}
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-align-left font-[AeonikArabic] text-white/70">
                    {logged.length} pending
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {logged.length > 0 ? (
                    logged.map((meal) => (
                      <div
                        key={meal.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-[AeonikArabic] text-white truncate">{meal.name}</p>
                          <p className="mt-1 font-[AeonikArabic] text-xs text-white/70">
                            {meal.calories ? `${meal.calories} kcal` : "Calories N/A"}
                            {meal.time ? ` • ${meal.time}` : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => meal.id && markAsEaten(meal.id)}
                          className="shrink-0 rounded-lg px-3 py-2 text-xs font-[AeonikArabic] bg-[#00B84A] hover:bg-green-700 transition"
                          type="button"
                        >
                          Mark eaten
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="font-[AeonikArabic] text-white/60 text-sm">
                      No {mealType.toLowerCase()} pending.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* small spacer so card doesn't feel cramped at bottom */}
        <div className="mt-auto" />
      </div>
    </section>
  );
}
