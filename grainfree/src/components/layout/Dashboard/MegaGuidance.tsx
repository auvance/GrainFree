"use client";

// import SafetySnapshot from "@/components/features/SafetySnapshot";
// import PlanGoals from "@/components/features/PlanGoals";

type PlanGoal = { title: string; progress: number };


export default function MegaGuidance({
  // planGoals,
  // onUpdateGuide,
  // onViewAllGoals,
  onAskCoach,
}: {
  planGoals: PlanGoal[];
  onUpdateGuide: () => void;
  onViewAllGoals: () => void;
  onAskCoach: () => void;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#22362F] via-[#1B2A25] to-[#15211D] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
            guidance
          </p>
          <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold text-white">
            Coach + Safety + Goals
          </h3>
          <p className="mt-1 font-[AeonikArabic] text-sm text-white/65 max-w-[70ch]">
            Everything that defines “safe” for you, and what you’re working toward.
          </p>
        </div>

        <button
          onClick={onAskCoach}
          className="shrink-0 rounded-xl bg-[#00B84A] hover:bg-green-700 transition px-4 py-2 text-xs font-[AeonikArabic]"
        >
          Ask Coach
        </button>
      </div>

    {/* Need to move this */}
      {/* <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <SafetySnapshot title="Safety snapshot" onUpdateGuide={onUpdateGuide} />
        </div>
        <div className="lg:col-span-5">
          <PlanGoals
            goals={planGoals}
            variant="preview"
            limit={4}
            onViewAll={onViewAllGoals}
            onBuildGuide={onUpdateGuide}
          />
        </div>
      </div> */}

    </section>
  );
}
