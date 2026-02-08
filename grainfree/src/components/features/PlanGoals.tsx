"use client";

import { useMemo } from "react";

type Goal = { title: string; progress: number };

export default function PlanGoals({
  goals = [],
  variant = "preview",
  limit = 4,
  onViewAll,
  onBuildGuide,
}: {
  goals: Goal[];
  variant?: "preview" | "full";
  limit?: number;
  onViewAll?: () => void;
  onBuildGuide?: () => void;
}) {
  const shown = useMemo(() => {
    const clean = Array.isArray(goals) ? goals : [];
    return variant === "full" ? clean : clean.slice(0, limit);
  }, [goals, limit, variant]);

  const empty = shown.length === 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#243A31] via-[#1E2F28] to-[#15221D] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_25%_20%,rgba(157,231,197,0.20),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_70%,rgba(0,184,74,0.18),transparent_55%)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
              progress
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              Your goals
            </h3>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              A clear path — updated as you log meals and follow your guide.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
              >
                View all
              </button>
            )}
            {onBuildGuide && (
              <button
                onClick={onBuildGuide}
                className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
              >
                Update guide
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-3">
          {empty ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-[AeonikArabic] text-sm text-white/80">
                No goals yet.
              </p>
              <p className="mt-1 font-[AeonikArabic] text-xs text-white/60">
                Build a guide to generate goals that match your restrictions + lifestyle.
              </p>
            </div>
          ) : (
            shown.map((g, i) => (
              <GoalRow key={`${g.title}-${i}`} goal={g} />
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-[AeonikArabic] text-xs text-white/55">
            Tip: “caution” foods will slow progress — scan products to stay consistent.
          </p>
        </div>
      </div>
    </section>
  );
}

function GoalRow({ goal }: { goal: { title: string; progress: number } }) {
  const pct = clamp(Math.round(Number(goal.progress ?? 0)), 0, 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-[AeonikArabic] text-sm font-medium text-white/90 truncate">
            {goal.title}
          </p>
          <p className="mt-1 font-[AeonikArabic] text-xs text-white/55">
            Progress target
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-[AeonikArabic] text-white/75">
          {pct}%
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#00B84A]/70"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
