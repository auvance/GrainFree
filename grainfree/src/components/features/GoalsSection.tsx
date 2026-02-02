"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type Goal = {
  title: string;
  progress: number; // 0–100
};

function clamp(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function GoalsSection({ goals = [] }: { goals?: Goal[] }) {
  const router = useRouter();
  const { user } = useAuth();

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
      const { error } = await supabase
        .from("healthplans")
        .delete()
        .eq("user_id", user.id);

      if (error) console.error("Supabase delete error:", error);
    } catch (err) {
      console.error("Error wiping plan:", err);
    }

    router.push("/system");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Goals list */}
        <section className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
          <div className="relative">
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              goals
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.7rem] sm:text-[2.0rem] font-semibold">
              Your Health Goals
            </h2>
            <p className="mt-2 font-[AeonikArabic] text-white/75 max-w-[62ch]">
              Progress is a system. Track it lightly, consistently.
            </p>

            <div className="mt-6 space-y-4">
              {toRender.map((g) => {
                const p = clamp(g.progress);
                return (
                  <div
                    key={g.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-[AeonikArabic] text-white font-semibold">
                          {g.title}
                        </p>
                        <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
                          {p}% progress
                        </p>
                      </div>

                      <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs font-[AeonikArabic] text-white/70">
                        active
                      </span>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#9DE7C5]/90"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Start Fresh */}
        <aside className="lg:col-span-4 relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
          <div className="relative">
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              rebuild
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.4rem] font-semibold">
              Start fresh
            </h3>
            <p className="mt-2 font-[AeonikArabic] text-white/75 leading-relaxed">
              If your needs changed, regenerate a plan that fits your current
              goals and restrictions.
            </p>

            <button
              onClick={handleStartFresh}
              className="mt-5 w-full rounded-xl border border-white/12 bg-white/8 px-5 py-3 font-[AeonikArabic] text-sm hover:bg-white/12 transition"
            >
              Rebuild my plan
            </button>

            <p className="mt-3 font-[AeonikArabic] text-xs text-white/60">
              This removes your latest plan and takes you back to the wizard.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
