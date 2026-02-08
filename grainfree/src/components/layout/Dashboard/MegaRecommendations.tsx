"use client";

import CuratedSuggestions from "@/components/features/CuratedSuggestions";

export default function MegaRecommendations({
  items,
  onViewAll,
  onBuildGuide,
}: {
  items: any[];
  onViewAll: () => void;
  onBuildGuide: () => void;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1C2C26] via-[#17241F] to-[#121B18] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
            curated
          </p>
          <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold text-white">
            Recommended for you
          </h3>
          <p className="mt-1 font-[AeonikArabic] text-sm text-white/65 max-w-[70ch]">
            Small, high-leverage moves based on your plan.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onViewAll}
            className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
          >
            View all
          </button>
          <button
            onClick={onBuildGuide}
            className="rounded-xl border border-white/12 bg-black/25 hover:bg-white/10 transition px-4 py-2 text-xs font-[AeonikArabic]"
          >
            Rebuild guide
          </button>
        </div>
      </div>

      <div className="mt-5">
        <CuratedSuggestions
          items={items}
          variant="preview"
          limit={6}
          onViewAll={onViewAll}
          onBuildGuide={onBuildGuide}
        />
      </div>
    </section>
  );
}
