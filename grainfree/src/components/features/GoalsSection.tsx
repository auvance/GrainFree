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
    router.push("/system");
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Your Health Goals */}
      <section className="bg-[#2C4435] backdrop-blur-md rounded-[20px] pt-10 pb-10 pr-15 pl-15">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h2 className="font-[AeonikArabic] text-2xl md:text-3xl font-bold mb-2">
              Your Health Goals
            </h2>
            <p className="font-[AeonikArabic] italic text-[1.3rem] text-white/90-300 w-105">
              Track your progress towards achieving your personalized health
              objectives.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right max-w-sm">
            <p className="font-[AeonikArabic] text-[1.1rem] text-white mb-2">★ Want to Start Over?</p>
            <p className="font-[AeonikArabic] text-[0.85rem] text-white/90 w-75 mb-2">
              Your needs change — and so should your plan. If you’d like to
              rebuild from scratch, we’ve got you.
            </p>
            <button
              onClick={handleStartFresh}
              className="px-8 py-3 mt-5 rounded-lg font-[AeonikArabic] bg-[#3D4F46] hover:bg-[#2d3a34] text-white text-sm"
            >
              Start Fresh
            </button>
          </div>
        </div>

        {/* Goals as pill-like cards */}
        <div className="flex justify-center gap-7 mt-20 mb-10">
          {toRender.map((goal) => (
            <div
              key={goal.title}
              className="px-8 py-5 rounded-lg bg-[#47674E] font-[AeonikArabic] italic text-center text-white/70 text-sm font-normal"
            >
              {goal.title}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Active Goals */}
      <section className="bg-[#2C4435]  backdrop-blur-md rounded-[20px] pt-10 pb-10 pr-15 pl-15">
        <h2 className="font-[AeonikArabic] text-2xl font-bold mb-6">Active Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toRender.map((goal) => (
            <div
              key={goal.title}
              className="bg-[#334E3D] pt-10 pb-10 pr-13 pl-13 rounded-[10px]"
            >
              <h3 className="font-[AeonikArabic] italic font-semibold mb-2">{goal.title}</h3>
              <p className="font-[AeonikArabic] text-sm italic text-gray-300 mb-2">
                Progress – {goal.progress}%
              </p>
              <div className="w-full bg-[white/10] h-2 rounded-full">
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
