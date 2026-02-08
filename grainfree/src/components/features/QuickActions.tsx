"use client";

export default function QuickActions({
  onDiscover,
  onBuildGuide,
  onScan,
  onAskCoach,
}: {
  onDiscover: () => void;
  onBuildGuide: () => void;
  onScan: () => void;
  onAskCoach: () => void;
}) {
  const btn =
    "inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-[AeonikArabic] text-white hover:bg-white/12 transition";

  return (
    <section className="rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-5 sm:p-6">
      <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
        actions
      </p>
      <h3 className="mt-2 font-[AeonikArabic] text-[1.25rem] font-semibold">
        Quick actions
      </h3>

      <div className="mt-4 flex flex-col gap-2">
        <button className={btn} onClick={onDiscover}>
          Discover
        </button>
        <button className={btn} onClick={onScan}>
          Scan product
        </button>
        <button className={btn} onClick={onAskCoach}>
          Ask coach
        </button>
        <button className={btn} onClick={onBuildGuide}>
          Rebuild guide
        </button>
      </div>
    </section>
  );
}
