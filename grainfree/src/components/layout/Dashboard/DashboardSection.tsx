"use client";

import React from "react";

export default function DashboardSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 font-[AeonikArabic] text-[1.45rem] font-semibold">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}
