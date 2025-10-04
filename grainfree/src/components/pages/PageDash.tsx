"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

import StatsGrid from "@/components/features/StatsGrid";
import MealTracker from "@/components/features/MealTracker";
import GoalsSection from "@/components/features/GoalsSection";
import Recommendations from "@/components/features/Recommendations";
import SavedMeals from "@/components/features/SavedMeals";
import Header from "../layout/Header";

export default function DashboardPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "meals" | "goals" | "recommendations" | "saved"
  >("meals");
  const [showModal, setShowModal] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    caloriesToday: 0,
    goal: 2000,
    streak: 0,
    mealsLogged: 0,
    savedMeals: 0,
  });
  const sp = useSearchParams();

  // ─── Fetch on mount ───────────────────────────────────────────
  useEffect(() => {
    if (sp.get("newPlan") === "1") setShowModal(true);
  }, [sp]);

  useEffect(() => {
    if (!user) return;

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from("healthplans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) setPlan(data);
    };
    fetchPlan();

    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from("completed_meals")
        .select("*")
        .eq("user_id", user.id)
        .order("eaten_at", { ascending: false });

      if (!error && data) {
        setMeals(data);
        updateStats(data);
      }
    };
    fetchMeals();
  }, [user]);

  // ─── Update Stats ─────────────────────────────────────────────
  const updateStats = (meals: any[]) => {
    const today = new Date().toDateString();
    const todaysMeals = meals.filter(
      (m) =>
        m.completed &&
        m.eaten_at &&
        new Date(m.eaten_at).toDateString() === today
    );
  
    const totalCalories = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const totalProtein = todaysMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const totalFat = todaysMeals.reduce((sum, m) => sum + (m.fat || 0), 0);
    const streak = calculateStreak(meals);
  
    setStats((prev) => ({
      ...prev,
      caloriesToday: totalCalories,
      mealsLogged: todaysMeals.length,
      streak,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    }));
  };
  
  // ─── Calculate streak based on consecutive days with completed meals ──────────────
const calculateStreak = (meals: any[]) => {
  const dates = [...new Set(
    meals
      .filter((m) => m.completed && m.eaten_at)
      .map((m) => new Date(m.eaten_at).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    if (
      i === 0 ||
      (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) /
        86400000 ===
        1
    ) {
      streak++;
    } else break;
  }
  return streak;
};

  // ─── Handle Meal Add ──────────────────────────────────────────
  const handleMealAdded = (newMeal: any) => {
    setMeals((prev) => {
      // If the meal was just completed, remove it from list
      if (newMeal.completed) {
        const updated = prev.filter((m) => m.id !== newMeal.id);
        updateStats(updated);
        return updated;
      }
  
      // Otherwise, treat as new or updated
      const updated = [newMeal, ...prev];
      updateStats(updated);
      return updated;
    });
  };

  // ─── Tabs ─────────────────────────────────────────────────────
  const tabs = useMemo(
    () => [
      { id: "meals", label: "Meal Tracker" },
      { id: "goals", label: "My Goals" },
      { id: "recommendations", label: "Recommendations" },
      { id: "saved", label: "Saved Meals" },
    ],
    []
  );

  return (
    <main className="bg-gradient-to-b from-[#2F4339] to-[#496256] min-h-screen text-white">
      <Header />

      <section className="px-30 py-25 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="w-170">
            <h1 className="font-[AeonikArabic] text-[4rem] font-bold">Your Dashboard</h1>
            <p className="text-[1.5rem] font-[AeonikArabic] font-semibold text-gray-200">
              Welcome back
              {user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ""}!
            </p>
            <p className="text-[1.5rem] font-[AeonikArabic] text-[#C5C5C5]">
              Your personal dashboard of all the curated foods that we specifically designed for you.
            </p>
          </div>
          <StatsGrid
            caloriesToday={stats.caloriesToday}
            goal={stats.goal}
            streak={stats.streak}
            mealsLogged={stats.mealsLogged}
            savedMeals={stats.savedMeals}
          />
        </div>

        <div className="bg-[#364840] rounded-2xl p-2 flex gap-4 mb-8 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-25 py-2 rounded-2xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#212C27] text-white"
                  : "bg-[#304039] text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#2C4435] backdrop-blur-md rounded-xl p-6">
          {plan ? (
            <>
              {activeTab === "meals" && (
                <MealTracker meals={meals} onMealAdded={handleMealAdded} />
              )}
              {activeTab === "goals" && <GoalsSection goals={plan.goals} />}
              {activeTab === "recommendations" && (
                <Recommendations items={plan.recommendations} />
              )}
              {activeTab === "saved" && <SavedMeals />}
            </>
          ) : (
            <p className="text-gray-300">
              No plan yet. Please build one to get started.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
