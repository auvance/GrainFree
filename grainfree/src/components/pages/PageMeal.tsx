"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "../layout/Header";
import Image from "next/image";

type Nutrient = { name: string; amount: number; unit: string };

type Ingredient = {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
};

type Recipe = {
  id: number;
  title: string;
  image: string;
  summary?: string;
  extendedIngredients?: Ingredient[];
  analyzedInstructions?: { steps: { number: number; step: string }[] }[];
  nutrition?: { nutrients?: Nutrient[] };
};

export default function PageMeal() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");
  const [meal, setMeal] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { user } = useAuth();
  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  // ─────────────────────────────────────────────────────────────
  // FETCH MEAL DETAILS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMeal = async () => {
      if (!recipeId) return;

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_KEY}`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) throw new Error("Failed to load meal");

        setMeal(await res.json());
      } catch (err) {
        console.error("Meal fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [recipeId]);

  // ─────────────────────────────────────────────────────────────
  // SAVE MEAL TO SUPABASE
  // ─────────────────────────────────────────────────────────────
  const handleSaveMeal = async () => {
    if (!user) return alert("Please sign in.");
    if (!meal?.id) return;

    setSaving(true);

    try {
      const { data: exists } = await supabase
        .from("saved_meals")
        .select("id")
        .eq("user_id", user.id)
        .eq("meal_id", meal.id)
        .maybeSingle();

      if (exists) {
        setSaved(true);
        setSaving(false);
        return;
      }

      const calories = meal.nutrition?.nutrients?.find(
        (n) => n.name === "Calories"
      );

      await supabase.from("saved_meals").insert([
        {
          user_id: user.id,
          meal_id: meal.id,
          title: meal.title,
          image: meal.image,
          calories: calories?.amount || null,
        },
      ]);

      setSaved(true);
    } catch (err) {
      console.error("Save meal error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // LOADING / ERROR STATES
  // ─────────────────────────────────────────────────────────────
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading…
      </main>
    );

  if (error || !meal)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Meal not found
      </main>
    );

  // Nutrients
  const calories = meal.nutrition?.nutrients?.find((n) => n.name === "Calories");
  const protein = meal.nutrition?.nutrients?.find((n) => n.name === "Protein");
  const fat = meal.nutrition?.nutrients?.find((n) => n.name === "Fat");
  const carbs = meal.nutrition?.nutrients?.find(
    (n) => n.name === "Carbohydrates"
  );

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
      <Header />

      <section className="py-10 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT PANEL */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <Image src={meal.image} alt={meal.title} width={800} height={320} className="w-full h-80 object-cover" />

            <div className="p-8">
              <h1 className="text-3xl font-semibold italic mb-4">{meal.title}</h1>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2">Description</h2>
                <p
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: meal.summary || "" }}
                />
              </section>

              {/* INGREDIENTS — CLICKABLE */}
              {meal.extendedIngredients && (
                <section className="mb-8">
                  <h2 className="text-lg font-bold mb-3">Products Used</h2>

                  <div className="flex flex-col gap-3">
                    {meal.extendedIngredients.map((ing, index) => (
                      <Link
                        key={`${ing.id}-${index}-${ing.name}`}
                        href={`/product-search?name=${encodeURIComponent(ing.name)}`}
                        className="flex items-center gap-4 bg-[#F4F6F4] border border-gray-200 rounded-lg p-3 hover:bg-[#E0EFE6] transition"
                      >
                        <Image
                          src={`https://img.spoonacular.com/ingredients_100x100/${ing.image}`}
                          alt={ing.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded-md"
                        />

                        <div>
                          <p className="font-medium">{ing.name}</p>
                          <p className="text-sm text-gray-500">
                            {ing.amount} {ing.unit}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* INSTRUCTIONS */}
              {meal.analyzedInstructions?.length ? (
                <section>
                  <h2 className="text-lg font-bold mb-3">Instructions</h2>
                  <ol className="list-decimal list-inside space-y-2">
                    {meal.analyzedInstructions[0].steps.map((s) => (
                      <li key={s.number}>{s.step}</li>
                    ))}
                  </ol>
                </section>
              ) : (
                <p className="text-gray-500 italic">No instructions found.</p>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — FACTS */}
          <div className="bg-[#1E3B32] text-white rounded-2xl p-8 flex flex-col justify-between shadow-md">

            <div>
              <h2 className="text-2xl font-semibold italic mb-6 border-b border-white/20 pb-3">
                Facts
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-[#2C4D3C] p-3 rounded-lg text-center">
                  <p className="font-semibold">{Math.round(calories?.amount || 0)}</p>
                  <p className="text-sm text-gray-300">calories</p>
                </div>

                <div className="bg-[#2C4D3C] p-3 rounded-lg text-center">
                  <p className="font-semibold">{Math.round(protein?.amount || 0)}g</p>
                  <p className="text-sm text-gray-300">protein</p>
                </div>

                <div className="bg-[#2C4D3C] p-3 rounded-lg text-center">
                  <p className="font-semibold">{Math.round(carbs?.amount || 0)}g</p>
                  <p className="text-sm text-gray-300">carbs</p>
                </div>

                <div className="bg-[#2C4D3C] p-3 rounded-lg text-center">
                  <p className="font-semibold">{Math.round(fat?.amount || 0)}g</p>
                  <p className="text-sm text-gray-300">fats</p>
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSaveMeal}
              disabled={saving || saved}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                saved
                  ? "bg-green-700 cursor-not-allowed"
                  : "bg-[#009B3E] hover:bg-[#007d32]"
              }`}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save to Dashboard"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
