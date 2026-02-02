"use client";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/15 backdrop-blur-xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
      <div className="relative">
        <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
          {label}
        </p>
        <p className="mt-2 font-[AeonikArabic] text-[1.35rem] sm:text-[1.55rem] font-semibold text-white leading-tight">
          {value}
        </p>
        {sub ? (
          <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
            {sub}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function StatsGrid({
  caloriesToday,
  goal,
  streak,
  mealsLogged,
  savedMeals,
}: {
  caloriesToday: number;
  goal: number;
  streak: number;
  mealsLogged: number;
  savedMeals: number;
}) {
  const pct = goal > 0 ? Math.min(100, Math.round((caloriesToday / goal) * 100)) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="col-span-2">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/15 backdrop-blur-xl p-4 sm:p-5 ">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                  calories today
                </p>
                <p className="mt-2 font-[AeonikArabic] text-[1.6rem] sm:text-[1.9rem] font-semibold">
                  {caloriesToday} <span className="text-white/60">/ {goal}</span>
                </p>
                <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
                  {pct}% of your target
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="font-[AeonikArabic] text-xs text-white/60 uppercase tracking-[0.18em]">
                  streak
                </p>
                <p className="font-[AeonikArabic] text-lg font-semibold text-[#9DE7C5]">
                  {streak}d
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#9DE7C5]/90"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <StatCard label="meals logged" value={`${mealsLogged}`} sub="completed today" />
      <StatCard label="saved meals" value={`${savedMeals}`} sub="your safe list" />
    </div>
  );
}
