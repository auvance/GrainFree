"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import StatsGrid from "@/components/features/StatsGrid";
import MealTracker from "@/components/features/MealTracker";
import GoalsSection from "@/components/features/GoalsSection";
import Recommendations from "@/components/features/Recommendations";
import SavedMeals from "@/components/features/SavedMeals";
import Header from "../layout/Header";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"meals" | "goals" | "recommendations" | "saved">("meals");
  const [showModal, setShowModal] = useState(false);
  const sp = useSearchParams();

  useEffect(() => {
    if (sp.get("newPlan") === "1") setShowModal(true);
  }, [sp]);

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
    <main className="bg-[#475845]" >
    <Header/>
    <section className="min-h-screen  text-white px-6 py-8">      <div className="flex flex-	col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Your Dashboard</h1>
          <p className="text-lg text-gray-200">Welcome back!</p>
        </div>
        <StatsGrid />
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 ${
              activeTab === tab.id ? "border-b-2 border-[#008509] text-[#008509]" : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        {activeTab === "meals" && <MealTracker />}
        {activeTab === "goals" && <GoalsSection />}
        {activeTab === "recommendations" && <Recommendations />}
        {activeTab === "saved" && <SavedMeals />}
      </div>

      {/* New Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white text-[#222] p-6">
            <h3 className="text-2xl font-bold">Your plan is ready 🎉</h3>
            <p className="mt-2 text-gray-600">
              We generated your goals, meal structure, and recommendations. You can edit anytime.
            </p>

            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="rounded-lg border p-3">
                <p className="font-semibold">Goals</p>
                <p className="text-sm text-gray-600">Personalized targets to keep you on track.</p>
              </li>
              <li className="rounded-lg border p-3">
                <p className="font-semibold">Meal plan</p>
                <p className="text-sm text-gray-600">Breakfast → Dinner with smart snacks.</p>
              </li>
              <li className="rounded-lg border p-3">
                <p className="font-semibold">Recommendations</p>
                <p className="text-sm text-gray-600">Hand-picked meals & products.</p>
              </li>
              <li className="rounded-lg border p-3">
                <p className="font-semibold">Edit anytime</p>
                <p className="text-sm text-gray-600">Update your inputs and rebuild.</p>
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
