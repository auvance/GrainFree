"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "../layout/Header/Header";
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

function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

export default function PageMeal() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

  const [meal, setMeal] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "steps">(
    "overview"
  );

  const { user } = useAuth();
  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  // ─────────────────────────────────────────────────────────────
  // FETCH MEAL DETAILS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMeal = async () => {
      if (!recipeId) return;

      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${SPOONACULAR_KEY}`,
          { next: { revalidate: 3600 } }
        );

        if (!res.ok) throw new Error("Failed to load meal");
        const data = await res.json();
        setMeal(data);
      } catch (err) {
        console.error("Meal fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [recipeId, SPOONACULAR_KEY]);

  // ─────────────────────────────────────────────────────────────
  // DERIVED DATA (must be before early returns to follow Rules of Hooks)
  // ─────────────────────────────────────────────────────────────
  const shortSummary = useMemo(() => {
    // Spoonacular summary comes as HTML; we keep it but constrain layout
    return meal?.summary || "";
  }, [meal?.summary]);

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
        return;
      }

      const caloriesVal = meal.nutrition?.nutrients?.find(
        (n) => n.name === "Calories"
      );

      const { error: insertError } = await supabase.from("saved_meals").insert([
        {
          user_id: user.id,
          meal_id: Number(meal.id),
          title: meal.title,
          image: meal.image ?? null,
          calories: caloriesVal?.amount ?? null,
        },
      ]);

      if (insertError) throw insertError;

      setSaved(true);
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? (err as { message?: string }).message
          : String(err);
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : undefined;
      console.error("Save meal error:", msg || err, code ? { code } : "");
      alert(
        msg
          ? `Could not save meal: ${msg}`
          : "Could not save meal. Try again."
      );
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

  if (error || !meal) {
    return (
      <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
        <Header />
        <div className="max-w-2xl mx-auto px-6 md:px-16 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-2">Meal not found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t load this meal right now. Try again or go back.
          </p>
          <Link
            href="/grainhub"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#009B3E] text-white font-semibold hover:bg-[#007d32] transition"
          >
            Back to GrainFreeHub
          </Link>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // DERIVED DATA
  // ─────────────────────────────────────────────────────────────
  const nutrients = meal.nutrition?.nutrients || [];
  const calories = nutrients.find((n) => n.name === "Calories")?.amount || 0;
  const protein = nutrients.find((n) => n.name === "Protein")?.amount || 0;
  const fat = nutrients.find((n) => n.name === "Fat")?.amount || 0;
  const carbs = nutrients.find((n) => n.name === "Carbohydrates")?.amount || 0;

  const steps = meal.analyzedInstructions?.[0]?.steps || [];
  const ingredients = meal.extendedIngredients || [];

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#EAF2EB] text-gray-900">
      <Header />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pt-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <Link
              href="/grainhub"
              className="inline-flex items-center gap-2 text-sm text-[#1E3B32] hover:text-[#009B3E] transitio font-[AeonikArabic]"
            >
              <span className="text-lg">←</span>
              Back to GrainFreeHub
            </Link>

            <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight font-[AeonikArabic]">
              {meal.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2 font-[AeonikArabic]">
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
                onClick={() => setActiveTab("products")}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition font-[AeonikArabic]",
                  activeTab === "products"
                    ? "bg-[#1E3B32] text-white border-transparent"
                    : "bg-white/70 border-black/10 hover:bg-white"
                )}
              >
                Products Used ({ingredients.length})
              </button>
              <button
                onClick={() => setActiveTab("steps")}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition font-[AeonikArabic]",
                  activeTab === "steps"
                    ? "bg-[#1E3B32] text-white border-transparent"
                    : "bg-white/70 border-black/10 hover:bg-white"
                )}
              >
                Steps ({steps.length || 0})
              </button>
            </div>
          </div>

          {/* Desktop quick action */}
          <div className="hidden lg:flex items-center gap-3 font-[AeonikArabic]">
            <button
              onClick={handleSaveMeal}
              disabled={saving || saved}
              className={classNames(
                "px-5 py-3 rounded-full font-semibold transition shadow-sm font-[AeonikArabic]",
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
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Image card */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-black/5">
              <div className="relative w-full h-[240px] md:h-[360px]">
                <Image
                  src={meal.image}
                  alt={meal.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Tab panels */}
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
              {/* Panel header */}
              <div className="px-6 md:px-8 py-5 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-lg font-semibold font-[AeonikArabic]">
                  {activeTab === "overview"
                    ? "Overview"
                    : activeTab === "products"
                    ? "Products Used"
                    : "Instructions"}
                </h2>

                {/* subtle hint */}
                <span className="text-xs text-gray-500 font-[AeonikArabic]">
                  Tap chips above to switch
                </span>
              </div>

              <div className="px-6 md:px-8 py-6 font-[AeonikArabic]">
                {/* OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div
                      className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: shortSummary }}
                    />

                    {/* quick highlights */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 font-[AeonikArabic]">
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
                  </div>
                )}

                {/* PRODUCTS */}
                {activeTab === "products" && (
                  <>
                    {ingredients.length === 0 ? (
                      <p className="text-gray-600 italic">
                        No ingredients found for this recipe.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ingredients.map((ing, index) => (
                          <Link
                            key={`${ing.id}-${index}-${ing.name}`}
                            href={`/product-search?name=${encodeURIComponent(
                              ing.name
                            )}`}
                            className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-[#F4F6F4] hover:bg-[#E0EFE6] transition p-4"
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-black/5 flex items-center justify-center">
                              <Image
                                src={`https://img.spoonacular.com/ingredients_100x100/${ing.image}`}
                                alt={ing.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold truncate">
                                {ing.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {ing.amount} {ing.unit}
                              </p>
                            </div>

                            <span className="ml-auto text-sm text-[#1E3B32] opacity-0 group-hover:opacity-100 transition">
                              View →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* STEPS */}
                {activeTab === "steps" && (
                  <>
                    {steps.length === 0 ? (
                      <p className="text-gray-600 italic">
                        No instructions found for this recipe.
                      </p>
                    ) : (
                      <ol className="space-y-3">
                        {steps.map((s) => (
                          <li
                            key={s.number}
                            className="flex gap-3 rounded-2xl border border-black/5 bg-[#F4F6F4] p-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#1E3B32] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                              {s.number}
                            </div>
                            <p className="text-gray-800 leading-relaxed">
                              {s.step}
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT (Sticky facts) */}
          <aside className="lg:sticky lg:top-24 h-fit font-[AeonikArabic]">
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

                {/* subtle divider */}
                <div className="h-px bg-white/10 my-6" />

                {/* Secondary actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleSaveMeal}
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
                    onClick={() => setActiveTab("products")}
                    className="w-full py-3 rounded-2xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    Explore ingredients
                  </button>
                </div>
              </div>
            </div>

            {/* Small helper card */}
            <div className="mt-4 rounded-3xl bg-white/60 border border-black/5 p-5 text-sm text-gray-700">
              Tip: Tap <span className="font-semibold">Products Used</span> to
              jump straight into ingredient → product discovery.
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
              onClick={handleSaveMeal}
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

      {/* Extra padding so content doesn’t hide behind mobile bar */}
      <div className="lg:hidden h-24" />
    </main>
  );
}
