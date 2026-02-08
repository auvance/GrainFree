"use client";

type Panel = "guidance" | "recs" | "library";

export default function DashboardPanelSwitch({
  value,
  onChange,
}: {
  value: Panel;
  onChange: (v: Panel) => void;
}) {
  const tabs: { key: Panel; label: string; desc: string }[] = [
    { key: "guidance", label: "Guidance", desc: "Coach · Safety · Goals" },
    { key: "recs", label: "For you", desc: "Recommended actions" },
    { key: "library", label: "Library", desc: "Meals · Products" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
          command center
        </p>
        <h2 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold text-white">
          Your dashboard, organized
        </h2>
        <p className="mt-1 font-[AeonikArabic] text-sm text-white/65">
          Switch modes instead of hunting scattered cards.
        </p>
      </div>

      <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
        {tabs.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "rounded-xl px-4 py-2 text-left transition",
                "font-[AeonikArabic]",
                active
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-[11px] text-white/55">{t.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
