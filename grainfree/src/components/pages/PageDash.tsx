"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header/Header";

import TodaysStats from "@/components/features/TodaysStats";
import TodayMealLog, { type Meal } from "@/components/features/TodayMealLog";

// hero actions
import QuickActions from "@/components/features/QuickActions";
import DashboardMobileSwitchDeck from "@/components/layout/Dashboard/DashboardMobileSwitchDeck";

// overlays + modes
import DashboardModeOverlay from "./DashboardModeOverlay";
import CoachExperience from "@/components/layout/QuickActions/CoachExperience";
import RebuildGuidePanel from "@/components/layout/QuickActions/RebuildGuidePlan";
import ScanExperience from "@/components/layout/Dashboard/ScanExperience";

// panel switch + mega panels
import DashboardPanelSwitch from "@/components/layout/Dashboard/DashboardPanelSwitch";
import MegaGuidance from "@/components/layout/Dashboard/MegaGuidance";
import MegaRecommendations from "@/components/layout/Dashboard/MegaRecommendations";
import MegaLibrary from "@/components/layout/Dashboard/MegaLibrary";

type CompletedMeal = Meal & { id: string; completed?: boolean; eaten_at?: string };

type ProfileCalorieRow = { calorie_target: number | null };
type PlanGoal = { title: string; progress: number };
type PlanRecommendation = { title: string; why?: string };

type HealthPlan = {
  title?: string;
  description?: string;
  goals?: PlanGoal[];
  recommendations?: PlanRecommendation[];
  plan_json?: unknown;
  // if you want extra fields without "any":
  extra?: Record<string, unknown>;
} | null;


function calculateStreak(allMeals: CompletedMeal[]) {
  const completedMeals = allMeals.filter((m) => m.completed && m.eaten_at);
  if (completedMeals.length === 0) return 0;

  const uniqueDates = [
    ...new Set(completedMeals.map((m) => new Date(m.eaten_at!).toDateString())),
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
}

type DashboardMode = "dashboard" | "coach" | "scan" | "rebuild";
type DashPanel = "guidance" | "recs" | "library";

export default function PageDash() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user } = useAuth();

  const [plan, setPlan] = useState<HealthPlan>(null);
  const [meals, setMeals] = useState<CompletedMeal[]>([]);
  const [goal, setGoal] = useState<number>(2000);

  const [savedMealCount, setSavedMealCount] = useState(0);
  const [savedProductCount, setSavedProductCount] = useState(0);

  const [mode, setMode] = useState<DashboardMode>("dashboard");
  const [panel, setPanel] = useState<DashPanel>("guidance");

  const [stats, setStats] = useState({
    caloriesToday: 0,
    mealsLogged: 0,
    streak: 0,
  });

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      const [
        planRes,
        mealsRes,
        profileRes,
        savedMealsCountRes,
        savedProductsCountRes,
      ] = await Promise.all([
        supabase
          .from("healthplans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("completed_meals")
          .select("*")
          .eq("user_id", user.id)
          .order("eaten_at", { ascending: false }),

        supabase
          .from("profiles")
          .select("calorie_target")
          .eq("id", user.id)
          .maybeSingle(),

        supabase
          .from("saved_meals")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("saved_products")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      if (!planRes.error) setPlan(planRes.data ?? null);

      const dailyGoal = (profileRes.data as ProfileCalorieRow | null)?.calorie_target ?? 2000;
      setGoal(dailyGoal);

      setSavedMealCount(savedMealsCountRes.count ?? 0);
      setSavedProductCount(savedProductsCountRes.count ?? 0);

      if (!mealsRes.error && mealsRes.data) {
        const mealData = mealsRes.data as CompletedMeal[];
        setMeals(mealData);
        updateTodayStats(mealData, dailyGoal);
      }
    };

    run();
  }, [user]);

  const updateTodayStats = (allMeals: CompletedMeal[], dailyGoal: number) => {
    const today = new Date().toDateString();
    const todaysMeals = allMeals.filter(
      (m) =>
        m.completed &&
        m.eaten_at &&
        new Date(m.eaten_at!).toDateString() === today
    );

    const caloriesToday = todaysMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const streak = calculateStreak(allMeals);

    setStats({
      caloriesToday,
      mealsLogged: todaysMeals.length,
      streak,
    });

    setGoal(dailyGoal);
  };

  const handleMealAdded = (newMeal: Meal) => {
    setMeals((prev) => {
      const existingIndex = prev.findIndex((m) => m.id === newMeal.id);
      let updated: CompletedMeal[];

      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newMeal } as CompletedMeal;
      } else {
        updated = [{ ...newMeal, id: newMeal.id ?? "" } as CompletedMeal, ...prev];
      }

      updateTodayStats(updated, goal);
      return updated;
    });
  };

  const username: string =
    (user?.user_metadata?.username as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")?.[0] ||
    "there";

  const todayFocus = useMemo(() => {
    const firstGoal = plan?.goals?.[0]?.title;
    const firstRec = plan?.recommendations?.[0]?.title;
    if (firstGoal) return `Today focus: ${firstGoal}.`;
    if (firstRec) return `Today focus: try “${firstRec}”.`;
    return "Today focus: log one meal and build momentum.";
  }, [plan]);

  useEffect(() => {
    if (sp.get("newPlan") === "1") {
      // later: toast/modal “New guide created”
    }
  }, [sp]);

  return (
    <main className="min-h-screen bg-[#2E3F36] text-white">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#3D5A4C] via-[#31473D] to-[#1F2F28] border border-white/10">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(157,231,197,0.35),transparent_55%)]" />
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_80%_60%,rgba(0,184,74,0.22),transparent_55%)]" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/70">
                  command center
                </p>

                <h1 className="mt-3 font-[AeonikArabic] font-bold leading-[1.02] text-[clamp(2.1rem,4vw,3.4rem)]">
                  Welcome back, <span className="italic text-[#9DE7C5]">{username}</span>.
                </h1>

                <p className="mt-3 font-[AeonikArabic] text-white/85 leading-relaxed text-[1.02rem] sm:text-[1.08rem]">
                  {plan?.title
                    ? `${plan.title} — ${plan.description ?? "your personalized guide is ready."}`
                    : "Build your guide to unlock a truly personalized dashboard: safety rules, swaps, and routines that match your life."}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-2xl border border-white/12 bg-black/20 overflow-hidden">
                    <Image
                      src="/image/Home-SVG.svg"
                      alt="Dashboard icon"
                      fill
                      className="object-contain p-2 opacity-90"
                      sizes="40px"
                    />
                  </div>
                  <div className="font-[AeonikArabic] text-sm text-white/70">{todayFocus}</div>
                </div>
              </div>

              <div className="lg:w-[420px]">
                <QuickActions
                  onDiscover={() => router.push("/hub")}
                  onAskCoach={() => setMode("coach")}
                  onScan={() => setMode("scan")}
                  onBuildGuide={() => setMode("rebuild")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE/TABLET: single-slot switch + swipe UX */}
        <div className="block lg:hidden">
          <DashboardMobileSwitchDeck
            todayMeals={
              <TodayMealLog meals={meals} onMealAdded={handleMealAdded} />
            }
            todayStats={
              <TodaysStats
                caloriesToday={stats.caloriesToday}
                goal={goal}
                streak={stats.streak}
                mealsLogged={stats.mealsLogged}
                savedMeals={savedMealCount}
                savedProducts={savedProductCount}
              />
            }
            guidance={
              <MegaGuidance
                planGoals={plan?.goals ?? []}
                onUpdateGuide={() => router.push("/system")}
                onViewAllGoals={() => router.push("/dash?view=goals")}
                onAskCoach={() => setMode("coach")}
              />
            }
            recommendations={
              <MegaRecommendations
                items={plan?.recommendations ?? []}
                onViewAll={() => router.push("/dash?view=recs")}
                onBuildGuide={() => router.push("/system")}
              />
            }
            library={<MegaLibrary />}
          />
        </div>


        {/* TOP GRID */}
        <div className="hidden lg:grid grid-cols-12 mt-8 gap-6 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <TodayMealLog meals={meals} onMealAdded={handleMealAdded} />
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <TodaysStats
              caloriesToday={stats.caloriesToday}
              goal={goal}
              streak={stats.streak}
              mealsLogged={stats.mealsLogged}
              savedMeals={savedMealCount}
              savedProducts={savedProductCount}
            />
          </aside>
        </div>

        {/* SWITCHABLE “MEGA” AREA (this replaces scattered blocks) */}
        <div className="hidden lg:block mt-10 space-y-6">
          <DashboardPanelSwitch value={panel} onChange={setPanel} />

          <div className="relative">
            <div key={panel} className="animate-[fadeIn_180ms_ease-out]">
              {panel === "guidance" && (
                <MegaGuidance
                planGoals={plan?.goals ?? []}
                onUpdateGuide={() => router.push("/system")}
                  onViewAllGoals={() => router.push("/dash?view=goals")}
                  onAskCoach={() => setMode("coach")}
                />
              )}

              {panel === "recs" && (
                <MegaRecommendations
                  items={plan?.recommendations ?? []}
                  onViewAll={() => router.push("/dash?view=recs")}
                  onBuildGuide={() => router.push("/system")}
                />
              )}

              {panel === "library" && (
                <MegaLibrary
                  // if your MegaLibrary needs props later, pass them here
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODES */}
      {mode === "coach" && (
        <DashboardModeOverlay
          title="GrainFree Coach"
          description="Personal guidance based on your plan, allergies, and habits."
          tone="mint"
          onClose={() => setMode("dashboard")}
        >
          <CoachExperience plan={plan} onExitToDash={() => setMode("dashboard")} />
        </DashboardModeOverlay>
      )}

      {mode === "scan" && (
        <DashboardModeOverlay
          title="Scan a product"
          description="Check product safety against your allergen profile."
          tone="dark"
          onClose={() => setMode("dashboard")}
        >
          <ScanExperience
            onAskCoach={() => {
              setMode("coach");
              // later: store prefill and inject into CoachExperience
            }}
          />
        </DashboardModeOverlay>
      )}

      {mode === "rebuild" && (
        <DashboardModeOverlay
          title="Rebuild your guide"
          description="Review your current plan and choose how you'd like to improve it."
          tone="green"
          onClose={() => setMode("dashboard")}
        >
          <RebuildGuidePanel
            plan={plan}
            onTweakWithCoach={() => setMode("coach")}
            onStartFresh={() => router.push("/system")}
          />
        </DashboardModeOverlay>
      )}
    </main>
  );
}
