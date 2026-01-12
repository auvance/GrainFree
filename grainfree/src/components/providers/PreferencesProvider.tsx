"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

export type UserPreferences = {
  diet: string | null;                 // e.g. "gluten free", "vegan", "vegetarian", "ketogenic"
  allergens: string[];                 // normalized tokens: ["dairy","fish","peanut","tree nut"]
  calorieTarget: number;               // default 2000
  unit: "metric" | "imperial";         // default metric
  username?: string | null;
};

type PreferencesContextValue = {
  prefs: UserPreferences;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (next: Partial<UserPreferences>) => void;

  // Helpers
  spoonacularDietParam: string | null;
  spoonacularIntolerancesParam: string | null;
};

const DEFAULT_PREFS: UserPreferences = {
  diet: "gluten free",
  allergens: [],
  calorieTarget: 2000,
  unit: "metric",
  username: null,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function normalizeAllergens(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((x) => String(x).trim().toLowerCase())
    .filter(Boolean)
    .map((a) => {
      // normalize common user-facing names → Spoonacular tokens
      if (a === "nuts") return "tree nut";
      if (a === "nut") return "tree nut";
      if (a === "peanuts") return "peanut";
      if (a === "lactose") return "dairy";
      return a;
    });
}

function mapDietToSpoonacular(diet: string | null): string | null {
  if (!diet) return null;
  const d = diet.trim().toLowerCase();

  // Spoonacular supported diets:
  // "gluten free", "ketogenic", "vegetarian", "vegan", "pescetarian", "paleo", ...
  if (d.includes("gluten")) return "gluten free";
  if (d.includes("keto") || d.includes("low carb")) return "ketogenic";
  if (d.includes("vegan")) return "vegan";
  if (d.includes("vegetarian")) return "vegetarian";
  if (d.includes("pesc")) return "pescetarian";
  return d; // if you store already-compatible diet strings
}

function mapAllergensToIntolerances(allergens: string[]): string[] {
  // Spoonacular intolerances: dairy, egg, gluten, peanut, sesame, seafood, shellfish, soy, sulfite, tree nut, wheat...
  const set = new Set<string>();

  for (const a of allergens) {
    const x = a.toLowerCase();
    if (x.includes("dairy")) set.add("dairy");
    if (x.includes("fish")) set.add("fish"); // Spoonacular supports "seafood" too; fish works
    if (x.includes("shellfish")) set.add("shellfish");
    if (x.includes("soy")) set.add("soy");
    if (x.includes("egg")) set.add("egg");
    if (x.includes("sesame")) set.add("sesame");
    if (x.includes("peanut")) set.add("peanut");
    if (x.includes("tree nut") || x === "nut" || x === "nuts") set.add("tree nut");
    // If you ever store "gluten" here, you can add:
    // if (x.includes("gluten")) set.add("gluten");
  }

  return Array.from(set);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setPrefs(DEFAULT_PREFS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPrefs({
          diet: data.diet ?? "gluten free",
          allergens: normalizeAllergens(data.allergens),
          calorieTarget: Number(data.calorie_target ?? 2000),
          unit: (data.measurement_unit === "imperial" ? "imperial" : "metric"),
          username: data.username ?? user.user_metadata?.username ?? null,
        });
      } else {
        // If no profile row exists yet, create one (optional but useful)
        const bootstrap = {
          id: user.id,
          username: user.user_metadata?.username ?? null,
          diet: "gluten free",
          allergens: [],
          calorie_target: 2000,
          measurement_unit: "metric",
          updated_at: new Date().toISOString(),
        };
        await supabase.from("profiles").upsert(bootstrap);
        setPrefs(DEFAULT_PREFS);
      }
    } catch (e) {
      console.error("Preferences refresh error:", e);
      // fail soft: keep defaults
      setPrefs(DEFAULT_PREFS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateLocal = (next: Partial<UserPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...next }));
  };

  const spoonacularDietParam = useMemo(() => mapDietToSpoonacular(prefs.diet), [prefs.diet]);
  const spoonacularIntolerancesParam = useMemo(() => {
    const ints = mapAllergensToIntolerances(prefs.allergens);
    return ints.length ? ints.join(",") : null;
  }, [prefs.allergens]);

  const value: PreferencesContextValue = {
    prefs,
    loading,
    refresh,
    updateLocal,
    spoonacularDietParam,
    spoonacularIntolerancesParam,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
