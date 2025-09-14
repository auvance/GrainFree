"use client";

import { useState } from "react";

type Meal = {
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  time?: string;
};

export default function MealTracker({ meals = [] }: { meals?: Meal[] }) {
  const mealTypes: Meal["type"][] = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({});

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.type) return;
    // here you'd persist to Supabase
    console.log("Adding meal:", newMeal);
    setShowForm(false);
    setNewMeal({});
  };

  return (
    <div>
      {/* Header + Action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Today's Meals</h2>
          <p className="text-sm text-gray-300">
            Track your daily meals and monitor your nutrition.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
        >
          Create New Meal
        </button>
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Meal Name"
              value={newMeal.name || ""}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
            />
            <select
              value={newMeal.type || ""}
              onChange={(e) =>
                setNewMeal({ ...newMeal, type: e.target.value as Meal["type"] })
              }
              className="px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
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
              className="px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddMeal}
              className="px-4 py-2 rounded-lg bg-[#008509] hover:bg-green-700 text-white"
            >
              Add Meal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-900/70 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealTypes.map((mealType) => {
          const logged = meals.find((m) => m.type === mealType);

          return (
            <div
              key={mealType}
              className="bg-white/5 border border-white/10 p-4 rounded-lg"
            >
              <h3 className="font-semibold mb-2">{mealType}</h3>
              {logged ? (
                <p className="text-sm text-gray-200">
                  {logged.name} – {logged.calories || "??"} kcal{" "}
                  {logged.time ? `– ${logged.time}` : ""}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
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
