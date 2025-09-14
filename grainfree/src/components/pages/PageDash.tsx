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
  const sp = useSearchParams();

  useEffect(() => {
    if (sp.get("newPlan") === "1") setShowModal(true);
  }, [sp]);

  // Fetch latest plan from Supabase
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

      if (error) console.error("Supabase error:", error);
      else setPlan(data);
    };

    fetchPlan();
  }, [user]);

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
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="w-170">
            <h1 className="font-[AeonikArabic] text-[4rem] font-bold">Your Dashboard</h1>
            <p className="text-[1.5rem] font-[AeonikArabic] font-semibold text-gray-200">
              Welcome back
              {user?.user_metadata?.username ? `, ${user.user_metadata.username}` : ""}!
            </p>
            <p className="text-[1.5rem] font-[AeonikArabic] text-[#C5C5C5]">
            Your personal dashboard of all the curated foods 
            that we specifically designed for you.
            </p>
          </div>
          <StatsGrid />
        </div>

        {/* Tabs */}
        <div className="bg-[#364840] rounded-2xl p-2 flex gap-4 mb-8 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-25 py-2 rounded-2xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[#212C27] text-white" // Active pill (dark bg, white text)
                  : "bg-[#304039] text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


        {/* Active Section */}
        <div className="bg-[#2C4435] backdrop-blur-md rounded-xl p-6">
          {plan ? (
            <>
              {activeTab === "meals" && <MealTracker meals={plan.meals} />}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white text-[#222] p-6">
              <h3 className="text-2xl font-bold">Your plan is ready 🎉</h3>
              <p className="mt-2 text-gray-600">
                We generated your goals, meal structure, and recommendations.
                You can edit anytime.
              </p>

              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="rounded-lg border p-3">
                  <p className="font-semibold">Goals</p>
                  <p className="text-sm text-gray-600">
                    Personalized targets to keep you on track.
                  </p>
                </li>
                <li className="rounded-lg border p-3">
                  <p className="font-semibold">Meal plan</p>
                  <p className="text-sm text-gray-600">
                    Breakfast → Dinner with smart snacks.
                  </p>
                </li>
                <li className="rounded-lg border p-3">
                  <p className="font-semibold">Recommendations</p>
                  <p className="text-sm text-gray-600">
                    Hand-picked meals & products.
                  </p>
                </li>
                <li className="rounded-lg border p-3">
                  <p className="font-semibold">Edit anytime</p>
                  <p className="text-sm text-gray-600">
                    Update your inputs and rebuild.
                  </p>
                </li>
              </ul>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-[#008509] text-white"
                  onClick={() => setShowModal(false)}
                >
                  Explore dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
