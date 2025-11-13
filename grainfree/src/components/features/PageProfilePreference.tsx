"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

const DIET_OPTIONS = [
  "Gluten-Free",
  "Vegan",
  "Vegetarian",
  "Low Carb",
  "High Protein",
  "Dairy Free",
];

const ALLERGENS = ["Dairy", "Nuts", "Fish", "Soy", "Eggs", "Shellfish"];

export default function PageProfilePreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [diet, setDiet] = useState("Gluten-Free");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [unit, setUnit] = useState("metric");

  useEffect(() => {
    if (!user) return;
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setDiet(data.diet || "Gluten-Free");
          setAllergens(data.allergens || []);
          setCalorieGoal(data.calorie_target || 2000);
          setUnit(data.measurement_unit || "metric");
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [user]);

  const toggleAllergen = (a: string) => {
    setAllergens((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const updates = {
        id: user.id,
        diet,
        allergens,
        calorie_target: calorieGoal,
        measurement_unit: unit,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      setMessage("✅ Preferences updated successfully!");
    } catch (err) {
      console.error("Error saving preferences:", err);
      setMessage("⚠️ Could not save changes. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Account Preferences</h1>

      {loading ? (
        <p className="text-gray-300">Loading your preferences...</p>
      ) : (
        <div className="space-y-8 max-w-2xl">
          {/* Diet */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Diet Preference</h2>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full rounded-lg px-4 py-3 bg-[#1E3B32] border border-white/10 outline-none focus:ring-2 focus:ring-[#00B84A]"
            >
              {DIET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Allergens */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Avoid Allergens</h2>
            <div className="flex flex-wrap gap-3">
              {ALLERGENS.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  className={`px-4 py-2 rounded-full border ${
                    allergens.includes(a)
                      ? "bg-[#00B84A] border-[#00B84A]"
                      : "bg-transparent border-white/20"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Calorie Target */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Daily Calorie Goal</h2>
            <input
              type="number"
              min="1000"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              className="w-full rounded-lg px-4 py-3 bg-[#1E3B32] border border-white/10 outline-none focus:ring-2 focus:ring-[#00B84A]"
            />
          </div>

          {/* Measurement Unit */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Measurement Unit</h2>
            <div className="flex gap-3">
              {["metric", "imperial"].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-2 rounded-full border capitalize ${
                    unit === u
                      ? "bg-[#00B84A] border-[#00B84A]"
                      : "bg-transparent border-white/20"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                saving
                  ? "bg-green-800 cursor-wait"
                  : "bg-[#00B84A] hover:bg-[#00913A]"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <p className="text-gray-300 mt-3 text-sm italic">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
