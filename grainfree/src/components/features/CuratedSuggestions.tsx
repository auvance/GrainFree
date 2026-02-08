"use client";

type Rec = { title: string; why?: string };

export default function CuratedSuggestions({
  items,
  variant = "full",
  limit = 6,
  onViewAll,
  onBuildGuide,
  onSave,
  onAddToToday,
}: {
  items: Rec[];
  variant?: "full" | "preview";
  limit?: number;
  onViewAll?: () => void;
  onBuildGuide?: () => void;
  onSave?: (rec: Rec) => void;
  onAddToToday?: (rec: Rec) => void;
}) {
  const isPreview = variant === "preview";
  const list = (items ?? []).slice(0, isPreview ? limit : items.length);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              curated
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.45rem] font-semibold">
              Recommended for you
            </h2>
            {isPreview ? (
              <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                These should feel picked for your exact situation.
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

        {(!items || items.length === 0) ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="font-[AeonikArabic] text-white/85 font-semibold">
              No recommendations yet.
            </p>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              Build/rebuild your guide to generate personalized suggestions.
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
          <div className={isPreview ? "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3" : "mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
            {list.map((r) => (
              <div key={r.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-[AeonikArabic] text-white font-semibold">{r.title}</p>
                {r.why ? (
                  <p className="mt-1 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                    {r.why}
                  </p>
                ) : null}

                {/* Buttons become optional hooks */}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSave?.(r)}
                    className="rounded-xl bg-[#008509] hover:bg-green-700 transition px-3 py-2 text-xs font-[AeonikArabic]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToToday?.(r)}
                    className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-3 py-2 text-xs font-[AeonikArabic]"
                  >
                    Add to today
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isPreview && items && items.length > limit ? (
          <p className="mt-3 font-[AeonikArabic] text-xs text-white/60">
            +{items.length - limit} more
          </p>
        ) : null}
      </div>
    </section>
  );
}
