"use client";

type Goal = { title: string; progress: number };

function clamp(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function PlanGoals({
  goals,
  variant = "full",
  limit = 4,
  onViewAll,
  onBuildGuide,
}: {
  goals: Goal[];
  variant?: "full" | "preview";
  limit?: number;
  onViewAll?: () => void;
  onBuildGuide?: () => void;
}) {
  const isPreview = variant === "preview";
  const list = (goals ?? []).slice(0, isPreview ? limit : goals.length);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              plan
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.45rem] font-semibold">
              Your goals
            </h2>
            {isPreview ? (
              <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                Small wins drive momentum. Keep these visible.
              </p>
            ) : null}
          </div>

          {isPreview ? (
            <button
              onClick={onViewAll}
              className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
              type="button"
            >
              View all
            </button>
          ) : null}
        </div>

        {(!goals || goals.length === 0) ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="font-[AeonikArabic] text-white/85 font-semibold">
              No goals yet.
            </p>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              Build/rebuild your guide so we can generate goals tailored to you.
            </p>
            {onBuildGuide ? (
              <button
                onClick={onBuildGuide}
                className="mt-4 rounded-xl bg-[#008509] hover:bg-green-700 transition px-4 py-2 text-sm font-[AeonikArabic]"
                type="button"
              >
                Build my guide
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {list.map((g) => {
              const p = clamp(g.progress);
              return (
                <div key={g.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-[AeonikArabic] text-white font-semibold">
                      {g.title}
                    </p>
                    <span className="font-[AeonikArabic] text-xs text-white/70">
                      {p}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#9DE7C5]/90" style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}

            {isPreview && goals.length > limit ? (
              <p className="font-[AeonikArabic] text-xs text-white/60">
                +{goals.length - limit} more
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
