"use client";

import { useMemo } from "react";

type Rec = { title: string; why?: string };

export default function CuratedSuggestions({
  items = [],
  variant = "preview",
  limit = 6,
  onViewAll,
  onBuildGuide,
}: {
  items: Rec[];
  variant?: "preview" | "full";
  limit?: number;
  onViewAll?: () => void;
  onBuildGuide?: () => void;
}) {
  const shown = useMemo(() => {
    const clean = Array.isArray(items) ? items : [];
    return variant === "full" ? clean : clean.slice(0, limit);
  }, [items, limit, variant]);

  const empty = shown.length === 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1F332B] via-[#182720] to-[#111A16] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_25%,rgba(157,231,197,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_85%_75%,rgba(0,184,74,0.16),transparent_55%)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
              guidance
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              Recommended for you
            </h3>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              High-impact suggestions tailored to your guide.
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
                Rebuild guide
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-5">
          {empty ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-[AeonikArabic] text-sm text-white/80">
                No recommendations yet.
              </p>
              <p className="mt-1 font-[AeonikArabic] text-xs text-white/60">
                Build a guide to generate personalized suggestions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shown.map((r, idx) => (
                <div
                  key={`${r.title}-${idx}`}
                  className="rounded-2xl border border-white/10 bg-black/15 p-4 hover:bg-black/20 transition"
                >
                  <p className="font-[AeonikArabic] text-sm font-medium text-white/90">
                    {r.title}
                  </p>
                  <p className="mt-2 font-[AeonikArabic] text-xs text-white/65 leading-relaxed line-clamp-3">
                    {r.why || "A practical next step aligned to your guide and safety rules."}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-[AeonikArabic] text-white/75">
                      Next step
                    </span>
                    <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-[AeonikArabic] text-white/75">
                      Curated
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5">
          <p className="font-[AeonikArabic] text-xs text-white/55">
            Want deeper personalization? Use Coach → ask for swaps, routines, and symptom triggers.
          </p>
        </div>
      </div>
    </section>
  );
}
