"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePreferences } from "@/components/providers/PreferencesProvider";

const DIET_OPTIONS = [
  { label: "Gluten-Free", value: "gluten free" },
  { label: "Vegan", value: "vegan" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Low Carb (Keto)", value: "ketogenic" },
  { label: "High Protein", value: "high protein" }, // handled via query bias (not a Spoonacular diet)
];

const ALLERGEN_OPTIONS: { label: string; value: string }[] = [
  { label: "Dairy", value: "dairy" },
  { label: "Peanuts", value: "peanut" },
  { label: "Tree Nuts", value: "tree nut" },
  { label: "Fish", value: "fish" },
  { label: "Shellfish", value: "shellfish" },
  { label: "Soy", value: "soy" },
  { label: "Eggs", value: "egg" },
  { label: "Sesame", value: "sesame" },
];

export default function PageProfilePreferences() {
  const { user } = useAuth();
  const { prefs, loading: prefsLoading, refresh } = usePreferences();

  const [diet, setDiet] = useState(prefs.diet ?? "gluten free");
  const [allergens, setAllergens] = useState<string[]>(prefs.allergens ?? []);
  const [calorieGoal, setCalorieGoal] = useState<number>(prefs.calorieTarget ?? 2000);
  const [unit, setUnit] = useState<"metric" | "imperial">(prefs.unit ?? "metric");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Keep local form in sync when prefs load/refresh
  useEffect(() => {
    setDiet(prefs.diet ?? "gluten free");
    setAllergens(prefs.allergens ?? []);
    setCalorieGoal(prefs.calorieTarget ?? 2000);
    setUnit(prefs.unit ?? "metric");
  }, [prefs.diet, prefs.allergens, prefs.calorieTarget, prefs.unit]);

  const dirty = useMemo(() => {
    const a1 = [...(prefs.allergens ?? [])].sort().join(",");
    const a2 = [...(allergens ?? [])].sort().join(",");
    return (
      (prefs.diet ?? "gluten free") !== (diet ?? "gluten free") ||
      a1 !== a2 ||
      (prefs.calorieTarget ?? 2000) !== calorieGoal ||
      (prefs.unit ?? "metric") !== unit
    );
  }, [prefs, diet, allergens, calorieGoal, unit]);

  const toggleAllergen = (val: string) => {
    setAllergens((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setToast(null);

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

      // refresh provider so EVERYTHING updates app-wide
      await refresh();

      setToast({ type: "success", text: "Saved. Preferences now apply across your dashboard." });
      setTimeout(() => setToast(null), 2200);
    } catch (err) {
      console.error("Error saving preferences:", err);
      setToast({ type: "error", text: "Could not save changes. Please try again." });
      setTimeout(() => setToast(null), 2600);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = prefsLoading;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold font-[AeonikArabic]">Diet & Allergens</h1>
        <p className="text-white/50 mt-2 font-[AeonikArabic]">
          These rules automatically apply to GrainFreeHub, product search, and AI recommendations.
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-300 font-[AeonikArabic]">Loading your preferences…</p>
      ) : (
        <div className="space-y-6">
          {/* Toast */}
          {toast && (
            <div
              className={[
                "rounded-xl border px-4 py-3 text-sm font-[AeonikArabic]",
                toast.type === "success"
                  ? "border-[#00B84A]/30 bg-[#00B84A]/10 text-white"
                  : "border-red-500/30 bg-red-500/10 text-white",
              ].join(" ")}
            >
              {toast.text}
            </div>
          )}

          {/* Diet Card */}
          <Card title="Diet Mode" subtitle="Controls global recipe filtering.">
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none focus:ring-2 focus:ring-[#00B84A]/60 transition font-[AeonikArabic]"
            >
              {DIET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Card>

          {/* Allergens Card */}
          <Card
            title="Avoid Allergens"
            subtitle="We’ll exclude foods/products containing these allergens where possible."
          >
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((a) => {
                const active = allergens.includes(a.value);
                return (
                  <button
                    key={a.value}
                    onClick={() => toggleAllergen(a.value)}
                    className={[
                      "px-4 py-2 rounded-full border text-sm transition-all duration-150 ease-out font-[AeonikArabic]",
                      "active:scale-95",
                      active
                        ? "bg-[#00B84A] border-[#00B84A] text-black font-semibold"
                        : "bg-white/0 border-white/15 text-white/80 hover:bg-white/5",
                    ].join(" ")}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Targets Card */}
          <Card title="Nutrition Defaults" subtitle="Used for stats and goal tracking.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-2 font-[AeonikArabic]">Daily Calories</label>
                <input
                  type="number"
                  min={1000}
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="w-full rounded-xl px-4 py-3 bg-black/30 border border-white/10 outline-none focus:ring-2 focus:ring-[#00B84A]/60 transition font-[AeonikArabic]"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2 font-[AeonikArabic]">Units</label>
                <div className="flex gap-2">
                  {(["metric", "imperial"] as const).map((u) => {
                    const active = unit === u;
                    return (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={[
                          "flex-1 px-4 py-3 rounded-xl border text-sm transition-all duration-150 ease-out font-[AeonikArabic]",
                          "active:scale-[0.99]",
                          active
                            ? "bg-[#00B84A] border-[#00B84A] text-black font-semibold"
                            : "bg-white/0 border-white/15 text-white/80 hover:bg-white/5",
                        ].join(" ")}
                      >
                        {u}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Sticky Save Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between gap-4 border border-white/10 bg-black/20 rounded-2xl px-4 py-4">
              <div className="text-sm text-white/60 font-[AeonikArabic]">
                {dirty ? "You have unsaved changes." : "All changes saved."}
              </div>

              <button
                onClick={handleSave}
                disabled={!dirty || saving || !user}
                className={[
                  "px-6 py-3 rounded-xl font-semibold transition-all duration-150 ease-out font-[AeonikArabic]",
                  "active:scale-[0.99]",
                  !dirty || saving || !user
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-[#00B84A] text-black hover:brightness-110",
                ].join(" ")}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold font-[AeonikArabic]">{title}</h2>
        {subtitle && <p className="text-sm text-white/45 mt-1 font-[AeonikArabic]">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
