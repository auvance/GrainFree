"use client";

type Recommendation = {
  title: string;
  why?: string;
};

export default function Recommendations({ items = [] }: { items?: Recommendation[] }) {
  const fallback: Recommendation[] = [
    { title: "Mediterranean Quinoa Salad", why: "Balanced + gluten-free friendly." },
    { title: "Coconut Flour Muffins", why: "Good option for quick snacks." },
    { title: "Zucchini Noodle Pasta", why: "Low-gluten-risk comfort meal." },
  ];

  const toRender: Recommendation[] = items.length ? items : fallback;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
        <div className="relative">
          <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
            suggestions
          </p>
          <h2 className="mt-2 font-[AeonikArabic] text-[1.7rem] sm:text-[2.0rem] font-semibold">
            Recommended for you
          </h2>
          <p className="mt-2 font-[AeonikArabic] text-white/75 max-w-[60ch]">
            Based on your preferences and goals. Keep what works — ignore the rest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {toRender.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
            <div className="relative">
              <p className="font-[AeonikArabic] text-white font-semibold text-[1.05rem]">
                {item.title}
              </p>
              {item.why ? (
                <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                  {item.why}
                </p>
              ) : null}

              <button className="mt-4 rounded-xl px-4 py-2 text-xs font-[AeonikArabic] bg-[#008509] hover:bg-green-700 transition">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
