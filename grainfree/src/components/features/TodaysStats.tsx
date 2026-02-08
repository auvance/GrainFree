"use client";

function MiniStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
        {label}
      </p>
      <p className="mt-2 font-[AeonikArabic] text-[1.25rem] sm:text-[1.4rem] font-semibold text-white leading-tight">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 font-[AeonikArabic] text-xs sm:text-sm text-white/70">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export default function TodaysStats({
  caloriesToday,
  goal,
  streak,
  mealsLogged,
  savedMeals,
  savedProducts,
}: {
  caloriesToday: number;
  goal: number;
  streak: number;
  mealsLogged: number;
  savedMeals: number;
  savedProducts: number;
}) {
  const pct = goal > 0 ? Math.min(100, Math.round((caloriesToday / goal) * 100)) : 0;

  return (
    <section className="relative overflow-hidden rounded-tr-[20px] rounded-bl-[20px] border border-white/10 bg-gradient-to-br from-[#2B5446] via-[#223A32] to-[#1B2C26]">
      {/* different tonality than hero */}
      <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_25%_20%,rgba(157,231,197,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_80%_70%,rgba(0,184,74,0.16),transparent_60%)]" />

      <div className="relative p-3 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/70">
              today
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.45rem] sm:text-[1.6rem] font-semibold">
              Your stats
            </h2>
          </div>

          <div className="rounded-2xl border border-white/12 bg-black/20 px-3 py-2">
            <p className="font-[AeonikArabic] text-xs text-white/60 uppercase tracking-[0.18em]">
              streak
            </p>
            <p className="font-[AeonikArabic] text-lg font-semibold text-[#9DE7C5]">
              {streak}d
            </p>
          </div>
        </div>

        {/* Calories “hero row” */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
            calories
          </p>
          <p className="mt-2 font-[AeonikArabic] text-[1.8rem] sm:text-[2.1rem] font-semibold">
            {caloriesToday} <span className="text-white/60">/ {goal}</span>
          </p>
          <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
            {pct}% of your target
          </p>

          <div className="mt-4 h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#9DE7C5]/90"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Everything else becomes one embedded block */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-1  ">
          <MiniStat label="meals logged" value={`${mealsLogged}`} sub="completed today" />
          <MiniStat label="goal" value={`${goal} kcal`} sub="daily target" />
          <MiniStat label="saved meals" value={`${savedMeals}`} sub="your safe list" />
          <MiniStat label="saved products" value={`${savedProducts}`} sub="trusted picks" />
        </div>
      </div>
    </section>
  );
}
