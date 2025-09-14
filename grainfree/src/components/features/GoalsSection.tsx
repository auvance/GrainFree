"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type Goal = {
  title: string;
  progress: number; // 0–100
};

export default function GoalsSection({ goals = [] }: { goals?: Goal[] }) {
  const router = useRouter();
  const { user } = useAuth();

  // fallback if no goals passed
  const fallback = [
    { title: "Staying Gluten-Free", progress: 70 },
    { title: "Gain Healthy Weight", progress: 30 },
    { title: "Staying Lacto Free", progress: 50 },
    { title: "Feel Energetic", progress: 20 },
  ];

  const toRender = goals.length ? goals : fallback;

  const handleStartFresh = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      // delete all plans for this user
      const { error } = await supabase
        .from("healthplans")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase delete error:", error);
      }
    } catch (err) {
      console.error("Error wiping plan:", err);
    }

    // Redirect to build wizard
    router.push("/build");
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Your Health Goals */}
      <section className="bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Your Health Goals
            </h2>
            <p className="text-gray-300 max-w-xl">
              Track your progress towards achieving your personalized health
              objectives.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right max-w-sm">
            <p className="text-sm text-gray-300 mb-2">★ Want to Start Over?</p>
            <p className="text-xs text-gray-400 mb-2">
              Your needs change — and so should your plan. If you’d like to
              rebuild from scratch, we’ve got you.
            </p>
            <button
              onClick={handleStartFresh}
              className="px-4 py-2 rounded-lg bg-[#3D4F46] hover:bg-[#2d3a34] text-white text-sm"
            >
              Start Fresh
            </button>
          </div>
        </div>

        {/* Goals as pill-like cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {toRender.map((goal) => (
            <div
              key={goal.title}
              className="px-4 py-3 rounded-lg bg-white/10 text-center text-white text-sm font-medium"
            >
              {goal.title}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Active Goals */}
      <section className="bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toRender.map((goal) => (
            <div
              key={goal.title}
              className="bg-white/5 border border-white/10 p-5 rounded-lg"
            >
              <h3 className="font-semibold mb-2">{goal.title}</h3>
              <p className="text-sm italic text-gray-300 mb-2">
                Progress – {goal.progress}%
              </p>
              <div className="w-full bg-white/10 h-2 rounded-full">
                <div
                  className="bg-[#008509] h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
