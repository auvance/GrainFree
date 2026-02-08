"use client";

import { ReactNode, useEffect } from "react";

export default function DashboardModeOverlay({
  title,
  description,
  tone = "green",
  onClose,
  children,
}: {
  title: string;
  description?: string;
  tone?: "green" | "mint" | "dark";
  onClose: () => void;
  children: ReactNode;
}) {
  const toneMap = {
    green: "from-[#2F5A47] via-[#284338] to-[#1B2C26]",
    mint: "from-[#3E6B5B] via-[#2F5046] to-[#1E332C]",
    dark: "from-[#1F2B26] via-[#19231F] to-[#121917]",
  };

  // 🔒 LOCK BODY SCROLL
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${toneMap[tone]}`} />
      <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />

      {/* Content wrapper (NO scroll here) */}
      <div className="relative h-full">
        {/* Single scroll container */}
        <div className="pt-[150px] h-full overflow-y-auto">
          {/* Command row */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
                  command
                </p>
                <h1 className="mt-1 font-[AeonikArabic] text-2xl font-semibold text-white">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 font-[AeonikArabic] text-sm text-white/65 max-w-[52ch]">
                    {description}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="shrink-0 rounded-xl border border-white/15 px-4 py-2 text-sm font-[AeonikArabic] text-white/80 hover:bg-white/10 transition"
              >
                Back
              </button>
            </div>
          </div>

          {/* Mode content */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
