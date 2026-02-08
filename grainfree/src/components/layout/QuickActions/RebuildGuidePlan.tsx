"use client";

type HealthPlan = {
  title?: string;
  description?: string;
  goals?: { title: string; progress: number }[];
  recommendations?: { title: string; why?: string }[];
  created_at?: string;
  extra?: Record<string, unknown>;
} | null;

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function RebuildGuidePanel({
  plan,
  onTweakWithCoach,
  onStartFresh,
}: {
  plan: HealthPlan;
  onTweakWithCoach: () => void;
  onStartFresh: () => void;
}) {
  const topGoals = plan?.goals?.slice?.(0, 4) ?? [];
  const topRecs = plan?.recommendations?.slice?.(0, 4) ?? [];

  return (
    <div className="space-y-6">
      {/* Current plan summary */}
      <section className="rounded-[28px] border border-white/10 bg-black/20 p-6 sm:p-7">
        <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
          current guide
        </p>

        <h2 className="mt-2 font-[AeonikArabic] text-[1.6rem] sm:text-[1.9rem] font-semibold">
          {plan?.title ?? "No guide found yet"}
        </h2>

        <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed max-w-[75ch]">
          {plan?.description ??
            "You can rebuild anytime. If you’re not happy with your results, tweak via Coach or start fresh with the wizard."}
        </p>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {topGoals.map((g) => (
            <span
              key={g.title}
              className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
            >
              Goal: {g.title}
            </span>
          ))}
          {topRecs.map((r) => (
            <span
              key={r.title}
              className="rounded-full border border-white/12 bg-black/15 px-3 py-2 text-xs font-[AeonikArabic] text-white/75"
            >
              Tip: {r.title}
            </span>
          ))}
        </div>
      </section>

      {/* Decision cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tweak */}
        <button
          onClick={onTweakWithCoach}
          className={cx(
            "text-left rounded-[28px] border border-white/10 bg-white/5 hover:bg-white/8 transition p-6 sm:p-7"
          )}
          type="button"
        >
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
            recommended
          </p>
          <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
            Tweak with Coach
          </h3>
          <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
            Keep your current plan, but refine it: adjust symptoms, swap foods,
            tighten allergy rules, improve budget or meal prep structure.
          </p>
          <div className="mt-4 inline-flex rounded-xl bg-[#00B84A]/20 border border-[#00B84A]/25 px-4 py-2 text-xs font-[AeonikArabic] text-white/90">
            Continue with Coach →
          </div>
        </button>

        {/* Start fresh */}
        <button
          onClick={onStartFresh}
          className={cx(
            "text-left rounded-[28px] border border-white/10 bg-black/20 hover:bg-black/25 transition p-6 sm:p-7"
          )}
          type="button"
        >
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
            from scratch
          </p>
          <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
            Rebuild using Wizard
          </h3>
          <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
            Start over and generate a new guide. Best when your goals changed,
            your restrictions changed, or the plan felt off.
          </p>
          <div className="mt-4 inline-flex rounded-xl bg-white/10 border border-white/12 px-4 py-2 text-xs font-[AeonikArabic] text-white/85">
            Open wizard →
          </div>
        </button>
      </div>

      {/* Safety note */}
      <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
        <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
          safety note
        </p>
        <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
          GrainFree is for guidance and organization — always verify labels and
          consult a clinician for severe allergies or medical conditions.
        </p>
      </div>
    </div>
  );
}
