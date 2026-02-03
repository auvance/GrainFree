"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header/Header";

import StatsGrid from "@/components/features/StatsGrid";
import MealTracker from "@/components/features/MealTracker";
import GoalsSection from "@/components/features/GoalsSection";
import Recommendations from "@/components/features/Recommendations";
import SavedMeals from "@/components/features/SavedMeals";
import SavedProducts from "@/components/features/SavedProducts";

export default function DashboardPage() {
  const { user } = useAuth();
  const sp = useSearchParams();

  const [plan, setPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "meals" | "goals" | "recommendations" | "savedMeals" | "savedProducts"
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

  // ─── Query param hook ───────────────────────────────────────────
  useEffect(() => {
    if (sp.get("newPlan") === "1") setShowModal(true);
  }, [sp]);

  // ─── Calculate streak based on consecutive days with completed meals ──────────────
  const calculateStreak = (allMeals: any[]) => {
    const completedMeals = allMeals.filter((m) => m.completed && m.eaten_at);
    if (completedMeals.length === 0) return 0;

    const uniqueDates = [
      ...new Set(completedMeals.map((m) => new Date(m.eaten_at).toDateString())),
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const previous = new Date(uniqueDates[i - 1]);
      const diffDays = Math.floor(
        (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  };

  // ─── Update Stats ─────────────────────────────────────────────
  const updateStats = (allMeals: any[]) => {
    const today = new Date().toDateString();

    const todaysMeals = allMeals.filter(
      (m) =>
        m.completed &&
        m.eaten_at &&
        new Date(m.eaten_at).toDateString() === today
    );

    const totalCalories = todaysMeals.reduce(
      (sum, m) => sum + (m.calories || 0),
      0
    );

    const streak = calculateStreak(allMeals);

    setStats((prev) => ({
      ...prev,
      caloriesToday: totalCalories,
      mealsLogged: todaysMeals.length,
      streak,
    }));
  };

  // ─── Fetch plan + meals ───────────────────────────────────────
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

    fetchPlan();
    fetchMeals();
  }, [user]);

  // ─── Handle meal add/update from MealTracker ───────────────────
  const handleMealAdded = (newMeal: any) => {
    setMeals((prev) => {
      // if meal is completed, we keep it in the list (so stats can track),
      // but MealTracker will show pending meals only.
      const existingIndex = prev.findIndex((m) => m.id === newMeal.id);
      let updated: any[];

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newMeal };
      } else {
        updated = [newMeal, ...prev];
      }

      updateStats(updated);
      return updated;
    });
  };

  const tabs = useMemo(
    () => [
      { id: "meals", label: "Meal Tracker" },
      { id: "goals", label: "My Goals" },
      { id: "recommendations", label: "Recommendations" },
      { id: "savedMeals", label: "Saved Meals" },
      { id: "savedProducts", label: "Saved Products" },
    ],
    []
  );

  const username =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")?.[0] ||
    "there";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2F4339] via-[#395347] to-[#496256] text-white">
      <Header />

      {/* Page container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-70 bg-gradient-to-b from-white/10 to-transparent" />

              <div className="relative">
                <p className="font-[AeonikArabic] text-white/70 text-xs tracking-[0.18em] uppercase">
                  dashboard
                </p>

                <h1 className="mt-3 font-[AeonikArabic] font-bold leading-[1.03] text-[clamp(2.0rem,4vw,3.2rem)]">
                  Welcome,{" "}
                  <span className="italic text-[#9DE7C5]">{username}</span>.
                </h1>

                <p className="mt-3 font-[AeonikArabic] text-white/85 leading-relaxed text-[1.02rem] sm:text-[1.08rem] max-w-[62ch]">
                  Your personal space to track meals, keep a safe list, and stay
                  consistent — without the mental load.
                </p>

                {/* Tiny visual accent */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-2xl border border-white/12 bg-black/15 overflow-hidden">
                    <Image
                      src="/image/Home-SVG.svg"
                      alt="Dashboard icon"
                      fill
                      className="object-contain p-2 opacity-90"
                      sizes="40px"
                    />
                  </div>
                  <div className="font-[AeonikArabic] text-sm text-white/70">
                    Calm system. Clear signals. Real progress.
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="rounded-2xl border border-white/10 bg-black/15 backdrop-blur-xl p-2 ">
                <div className="flex justify-evenly gap-2 overflow-x-auto scrollbar-hide py-1">
                  {tabs.map((tab) => {
                    const active = activeTab === (tab.id as any);
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={[
                          "shrink-0 rounded-xl px-4 py-2.5 text-sm font-[AeonikArabic] transition",
                          active
                            ? "bg-white/12 border border-white/14 text-white"
                            : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-5">
            <StatsGrid
              caloriesToday={stats.caloriesToday}
              goal={stats.goal}
              streak={stats.streak}
              mealsLogged={stats.mealsLogged}
              savedMeals={stats.savedMeals}
            />
          </div>
        </div>

        {/* Content Panel */}
        <div className="mt-8 sm:mt-10">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-70 bg-gradient-to-b from-white/8 to-transparent" />

            {activeTab === "meals" && (
              <MealTracker meals={meals} onMealAdded={handleMealAdded} />
            )}
            {activeTab === "goals" &&
              (plan?.goals ? (
                <GoalsSection goals={plan.goals} />
              ) : (
                <div className="relative text-center py-10 sm:py-14">
                  <p className="font-[AeonikArabic] font-semibold text-[1.2rem]">
                    No plan yet.
                  </p>
                  <p className="mt-2 font-[AeonikArabic] text-white/70">
                    Build your plan first to see your goals here.
                  </p>
                </div>
              ))}
            {activeTab === "recommendations" &&
              (plan?.recommendations ? (
                <Recommendations items={plan.recommendations} />
              ) : (
                <div className="relative text-center py-10 sm:py-14">
                  <p className="font-[AeonikArabic] font-semibold text-[1.2rem]">
                    No plan yet.
                  </p>
                  <p className="mt-2 font-[AeonikArabic] text-white/70">
                    Build your plan first to get recommendations.
                  </p>
                </div>
              ))}
            {activeTab === "savedMeals" && <SavedMeals />}
            {activeTab === "savedProducts" && <SavedProducts />}
          </div>
        </div>
      </div>
    </main>
  );
}
