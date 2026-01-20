"use client";

type Props = {
  title: string;
  desc: string;
  tag: string;
  col?: string;
};

export default function FeatureCard({ title, desc, tag, col }: Props) {
  return (
    <div className={`${col ?? ""}`}>
      <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-[#617862]/45 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1">
        {/* micro shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-70" />
        {/* hover glow */}
        <div
          className="pointer-events-none absolute -inset-16 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, rgba(157,231,197,0.18), transparent 60%)",
          }}
        />

        <div className="relative p-7 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-[AeonikArabic] text-xs tracking-[0.16em] uppercase text-white/70">
              {tag}
            </p>
            <span className="h-2 w-2 rounded-full bg-[#9DE7C5]/90 shadow-[0_0_24px_rgba(157,231,197,0.45)]" />
          </div>

          <h3 className="mt-3 font-[AeonikArabic] text-[1.4rem] sm:text-[1.55rem] font-semibold leading-tight">
            {title}
          </h3>

          <p className="mt-3 font-[AeonikArabic] text-white/80 text-[1rem] sm:text-[1.05rem] leading-relaxed">
            {desc}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-[AeonikArabic] text-white/75">
            <span className="h-[1px] w-6 bg-white/25 transition-all duration-300 group-hover:w-10" />
            <span className="transition-colors duration-300 group-hover:text-white">
              Explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
