"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type Meal = {
  id?: string;
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  time?: string;
  eaten_at?: string;
  completed?: boolean;
};

export default function MealTracker({
  meals = [],
  onMealAdded,
}: {
  meals?: Meal[];
  onMealAdded?: (m: Meal) => void;
}) {
  const { user } = useAuth();
  const mealTypes: Meal["type"][] = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY;

  // ─── Fetch meal suggestions ───────────────────────────────
  useEffect(() => {
    if (!newMeal.name || newMeal.name.length < 3) return;
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${newMeal.name}&number=5&addRecipeNutrition=true&apiKey=${SPOONACULAR_KEY}`,
          { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Error fetching recipes", err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [newMeal.name]);

  // ─── Add Meal (Pending) ─────────────────────────────────────
  const handleAddMeal = async () => {
    if (!user || !newMeal.name || !newMeal.type) return;

    const mealToAdd = {
      ...newMeal,
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
    setShowForm(false);
    setNewMeal({});
    setSuggestions([]);
  };

 // ─── Mark as Completed ─────────────────────────────────────
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

  // ✅ Remove the meal instantly from local list
  onMealAdded?.(data); // this updates stats in parent

  // Trigger local UI update without reload
  setSuggestions([]);
  setShowForm(false);

  // Remove the completed meal from displayed pending meals
  const updated = meals.filter((m) => m.id !== mealId);
  // @ts-ignore — safe to call this way for your structure
  onMealAdded?.({ ...data, _refreshMeals: updated });
};


  return (
    <div>
      {/* Header */}

      <div className=" bg-[#2C4435] pt-15 pb-15 pl-10 pr-10 mb-6 rounded-[20px]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[2rem] font-[AeonikArabic] font-semibold">Today's Meals</h2>
            <p className="text-[1.2rem] font-[AeonikArabic] text-gray-300">
              Track your daily meals and mark them when eaten.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-10 py-5 text-sm rounded-lg bg-[#223528] text-[1rem] font-[AeonikArabic]"
          >
            Create New Meal
          </button>
        </div>

      {/* Add Meal Form */}
      {showForm && (
      <div className="mt-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Enter Meal Name"
              value={newMeal.name || ""}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="px-3 py-2 rounded bg-[#3A5340]"
            />
            <input
              type="number"
              placeholder="Calories (optional)"
              value={newMeal.calories || ""}
              onChange={(e) =>
                setNewMeal({ ...newMeal, calories: Number(e.target.value) })
              }
              className="px-3 py-2 rounded bg-[#3A5340]"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-[#223528] border border-white/10 rounded-lg z-50">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      const macros = s.nutrition?.nutrients?.reduce(
                        (acc: any, n: any) => {
                          if (n.name === "Protein") acc.protein = n.amount;
                          if (n.name === "Carbohydrates") acc.carbs = n.amount;
                          if (n.name === "Fat") acc.fat = n.amount;
                          return acc;
                        },
                        { protein: 0, carbs: 0, fat: 0 }
                      );
                    
                      setNewMeal({
                        ...newMeal,
                        name: s.title,
                        calories: Math.round(
                          s.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount ||
                            0
                        ),
                        ...macros,
                      });
                    }}
                    className="px-3 py-2 text-sm hover:bg-white/10 cursor-pointer"
                  >
                    {s.title}
                  </div>
                ))}
              </div>
            )}

            <select
              value={newMeal.type || ""}
              onChange={(e) =>
                setNewMeal({ ...newMeal, type: e.target.value as Meal["type"] })
              }
              className="px-3 py-2 rounded bg-[#3A5340] "
            >
              <option value="">Select Type</option>
              {mealTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={newMeal.time || ""}
              onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
              className="px-3 py-2 rounded bg-[#3A5340]"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddMeal}
              className="px-13 py-2 font-[AeonikArabic] rounded-[10px] bg-[#008509] hover:bg-green-700 text-white"
            >
              Add Meal
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewMeal({});
                setSuggestions([]);
              }}
              className="px-13 py-2 font-[AeonikArabic] rounded-[10px] bg-[#352225] hover:bg-red-900/70 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      </div>

      

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealTypes.map((mealType) => {
          const logged = meals.filter(
            (m) => m.type === mealType && !m.completed
          );

          return (
            <div
              key={mealType}
              className="bg-[#2C4435] text-[1.5rem] border border-white/10 pt-15 py-15 pr-10 pl-10 rounded-[20px]"
            >
              <h3 className="font-semibold mb-2 font-[AeonikArabic]">{mealType}</h3>
              {logged.length > 0 ? (
                logged.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div>
                      <p className="text-sm text-gray-200">
                        {meal.name} – {meal.calories || "??"} kcal{" "}
                        {meal.time ? `– ${meal.time}` : ""}
                      </p>
                      <p
                        className={`text-xs italic ${
                          meal.completed
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {meal.completed ? "Completed" : "Added"}
                      </p>
                    </div>
                    {!meal.completed && (
                      <button
                        onClick={() => markAsEaten(meal.id!)}
                        className="text-xs px-3 py-1 rounded bg-[#008509] hover:bg-green-700"
                      >
                        Mark as Eaten
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[1rem] font-[AeonikArabic] text-gray-400 ">
                  No {mealType} logged yet.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
