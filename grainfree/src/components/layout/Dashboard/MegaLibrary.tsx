"use client";

import SafeMealLibrary from "@/components/features/SafeMealLibrary";
import SafeProductLibrary from "@/components/features/SafeProductLibrary";

export default function MegaLibrary() {
  return (
    <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#202F2A] via-[#182521] to-[#121B18] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
            library
          </p>
          <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold text-white">
            Your safe defaults
          </h3>
          <p className="mt-1 font-[AeonikArabic] text-sm text-white/65 max-w-[70ch]">
            Reuse what’s already proven safe — meals and products.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <SafeMealLibrary variant="preview" limit={6} />
        </div>
        <div className="lg:col-span-6">
          <SafeProductLibrary variant="preview" limit={6} />
        </div>
      </div>
    </section>
  );
}
