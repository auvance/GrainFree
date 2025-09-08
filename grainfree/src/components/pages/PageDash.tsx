"use client";

import { useState } from "react";
import StatsGrid from "@/components/features/StatsGrid";
import MealTracker from "@/components/features/MealTracker";
import GoalsSection from "@/components/features/GoalsSection";
import Recommendations from "@/components/features/Recommendations";
import SavedMeals from "@/components/features/SavedMeals";
import Header from "../layout/Header";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "meals" | "goals" | "recommendations" | "saved"
  >("meals");

  const tabs = [
    { id: "meals", label: "Meal Tracker" },
    { id: "goals", label: "My Goals" },
    { id: "recommendations", label: "Recommendations" },
    { id: "saved", label: "Saved Meals" },
  ];

  return (
    <main className="bg-[#475845]" >
    <Header/>
    <section className="min-h-screen  text-white px-6 py-8">
      {/* Welcome + stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Your Dashboard</h1>
          <p className="text-lg text-gray-200">
            Welcome, <span className="font-semibold">Aakif!</span>
          </p>
        </div>
        <StatsGrid />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 ${
              activeTab === tab.id
                ? "border-b-2 border-[#008509] text-[#008509]"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        {activeTab === "meals" && <MealTracker />}
        {activeTab === "goals" && <GoalsSection />}
        {activeTab === "recommendations" && <Recommendations />}
        {activeTab === "saved" && <SavedMeals />}
      </div>
    </section>
    </main>
  );
}
