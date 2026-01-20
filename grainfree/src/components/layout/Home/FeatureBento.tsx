"use client";

import Link from "next/link";
import React, { useRef } from "react";
import FeatureCard from "../Home/FeatureCard";

export default function FeatureBento() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  return (
    <section className="relative overflow-hidden bg-[#475845] text-white">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/10 blur-[110px]" />
        <div className="absolute -bottom-56 right-[-120px] h-[640px] w-[640px] rounded-full bg-[#9DE7C5]/12 blur-[120px]" />
        <div className="absolute left-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-black/20 blur-[120px]" />
      </div>

      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"300\" height=\"300\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28">
        <header className="text-center">
          <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.18em] uppercase">
            built for real people, real restrictions
          </p>

          <h2 className="mt-4 font-[AeonikArabic] font-bold text-[2.4rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.05]">
            It&apos;s not just a <span className="italic">&apos;Guide&apos;</span>
          </h2>

          <p className="font-[AeonikArabic] mt-4 text-[1.1rem] sm:text-[1.4rem] text-white/85">
            Everything Grainless does is built around one question:
          </p>

          <p className="font-[AeonikArabic] mt-2 text-[1.2rem] sm:text-[1.55rem] italic text-white/85">
            &quot;What would&apos;ve helped me when I was struggling?&quot;
          </p>
        </header>

        <div
          ref={wrapRef}
          onMouseMove={onMove}
          className="relative mt-14 sm:mt-16 lg:mt-20"
          style={
            {
              ["--mx" as string]: "50%",
              ["--my" as string]: "40%",
            } as React.CSSProperties
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* HERO CARD */}
            <div className="lg:col-span-7 lg:row-span-2">
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#617862]/55 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mx) var(--my), rgba(157,231,197,0.22), transparent 55%)",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-70" />

                <div className="relative p-8 sm:p-10">
                  <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.16em] uppercase">
                    your safe-food operating system
                  </p>

                  <h3 className="mt-4 font-[AeonikArabic] font-semibold text-[2rem] sm:text-[2.35rem] leading-[1.08]">
                    Less second-guessing.
                    <br />
                    More confidence.
                  </h3>

                  <p className="mt-4 font-[AeonikArabic] text-white/85 text-[1.05rem] sm:text-[1.15rem] leading-relaxed max-w-[52ch]">
                    GrainFree isn&apos;t a list of &quot;maybe safe&quot; foods.
                    It&apos;s a system that helps you discover meals, verify
                    products, and build habits — around your exact restrictions.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/70">
                        today
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold">
                        1,842 kcal
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        macros + streaks + goals
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/70">
                        safety
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold text-[#9DE7C5]">
                        flags detected
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        allergens + labels
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <Link
                      href="/system"
                      className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-[#8EB397] px-7 py-4 font-[AeonikArabic] font-medium text-[#1f2a24] shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#3D4F46]"
                    >
                      Get Started
                    </Link>
                    <span className="font-[AeonikArabic] text-white/70 text-sm">
                      Free. No pricing. No traps.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <FeatureCard
              col="lg:col-span-5"
              title="Save your favorites"
              desc="Bookmark meals + products so your &apos;safe list&apos; grows with you."
              tag="personal library"
            />

            <FeatureCard
              col="lg:col-span-5"
              title="Filter by goals"
              desc="Gain weight, eat clean, budget-friendly — find what fits fast."
              tag="instant clarity"
            />

            <FeatureCard
              col="lg:col-span-6"
              title="Dietary flags built-in"
              desc="Lactose-free, nut-free, soy-free… labeled so you stop guessing."
              tag="trust layer"
            />

            <FeatureCard
              col="lg:col-span-6"
              title="Constantly evolving"
              desc="Smarter filters, better meals, more products — regularly improved."
              tag="living product"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-[AeonikArabic] text-white/80 text-lg sm:text-xl">
            Built to feel calm when food doesn&apos;t.
          </p>
        </div>
      </div>
    </section>
  );
}
