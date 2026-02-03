"use client";

import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

type Feature = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  metric?: { label: string; value: string; sub: string };
};

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

export default function FeatureBento() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>("library");

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  const FEATURES: Feature[] = useMemo(
    () => [
      {
        id: "library",
        tag: "personal library",
        title: "Save your safe list",
        desc: "Bookmark meals and products so your system gets smarter with you — not your memory.",
        metric: { label: "saved", value: "128", sub: "items you trust" },
      },
      {
        id: "filters",
        tag: "instant clarity",
        title: "Filter by goals",
        desc: "Gain weight, eat clean, budget-friendly — find what fits fast without endless scrolling.",
        metric: { label: "time", value: "↓ 62%", sub: "decision fatigue" },
      },
      {
        id: "flags",
        tag: "trust layer",
        title: "Dietary flags built-in",
        desc: "Lactose-free, nut-free, soy-free… surfaced early so you stop guessing.",
        metric: { label: "flags", value: "smart", sub: "signals up front" },
      },
      {
        id: "scan",
        tag: "scan + verify",
        title: "Barcode-ready",
        desc: "Quickly check a product and route to a clean detail view with ingredients and tags.",
        metric: { label: "flow", value: "1 tap", sub: "scan → product detail" },
      },
      {
        id: "evolving",
        tag: "living product",
        title: "Constantly evolving",
        desc: "Better filters, better data, better recommendations — improved over time, not abandoned.",
        metric: { label: "updates", value: "weekly", sub: "iteration cadence" },
      },
    ],
    []
  );

  const active = FEATURES.find((f) => f.id === activeId) ?? FEATURES[0];

  return (
    <section className="relative overflow-hidden bg-[#475845] text-white">
      {/* Orbit animation CSS (single styled-jsx only) */}
      <style jsx global>{`
        @keyframes gf-orbit-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .gf-orbit {
          animation: gf-orbit-rotate 22s linear infinite;
          transform-origin: center;
          will-change: transform;
        }

        .gf-orbit-counter {
          animation: gf-orbit-rotate 22s linear infinite reverse;
          transform-origin: center;
          will-change: transform;
        }

        .gf-stage:hover .gf-orbit,
        .gf-stage:hover .gf-orbit-counter {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .gf-orbit,
          .gf-orbit-counter {
            animation: none !important;
          }
        }
      `}</style>

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
        {/* Header */}
        <header className="text-center">
          <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.18em] uppercase">
            built for real people, real restrictions
          </p>

          <h2 className="mt-4 font-[AeonikArabic] font-bold text-[2.4rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.05]">
            It&apos;s not just a <span className="italic">&apos;Guide&apos;</span>
          </h2>

          <p className="font-[AeonikArabic] mt-4 text-[1.1rem] sm:text-[1.4rem] text-white/85">
            Everything GrainFree is built around one question:
          </p>

          <p className="font-[AeonikArabic] mt-2 text-[1.2rem] sm:text-[1.55rem] italic text-white/85">
            &quot;What would&apos;ve helped me when I was struggling?&quot;
          </p>
        </header>

        {/* ORBIT SYSTEM */}
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          className="relative mt-34 sm:mt-16 lg:mt-20"
          style={
            {
              ["--mx" as string]: "50%",
              ["--my" as string]: "40%",
            } as React.CSSProperties
          }
        >
          {/* Soft mouse glow */}
          

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-30 lg:gap-12 items-center">
            {/* LEFT: Orbit Stage */}
            <div className="lg:col-span-7">
              {/* Set radius via CSS var (no nested style tags) */}
              <div className="gf-stage relative mx-auto aspect-square w-full max-w-[620px] [--r:200px] md:[--r:250px] lg:[--r:250px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/12 bg-white/5 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.1)]" />
                <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 opacity-40" />

                {/* Rotating ring */}
                <div className="gf-orbit absolute inset-0 z-50">
                  {FEATURES.map((f, idx) => {
                    const isActive = f.id === activeId;
                    const angle = (360 / FEATURES.length) * idx - 90;

                    return (
                      <div
                        key={f.id}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(var(--r)) rotate(${-angle}deg)`,
                        }}
                      >
                        {/* Counter rotate so it stays upright */}
                        <div className="gf-orbit-counter">
                          <button
                            type="button"
                            onClick={() => setActiveId(f.id)}
                            onMouseEnter={() => setActiveId (f.id)}
                            aria-pressed={isActive}
                            className={cn(
                              "rounded-2xl border backdrop-blur-xl text-left transition",
                              "px-4 py-3 max-w-[210px]",
                              "shadow-[0_18px_45px_rgba(0,0,0,0.18)]",
                              isActive
                                ? "border-white/22 bg-white/12"
                                : "border-white/12 bg-white/6 hover:bg-white/10"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full transition shadow-[0_0_22px_rgba(157,231,197,0.5)]",
                                  isActive
                                    ? "bg-[#9DE7C5]/95"
                                    : "bg-white/35 hover:bg-[#9DE7C5]/85"
                                )}
                              />
                              <span className="font-[AeonikArabic] text-[11px] tracking-[0.18em] uppercase text-white/70">
                                {f.tag}
                              </span>
                            </div>
                            <p className="mt-2 font-[AeonikArabic] text-sm sm:text-[0.98rem] font-semibold text-white">
                              {f.title}
                            </p>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Center core card — ALWAYS ABOVE orbit nodes */}
                <div className="absolute left-1/2 top-1/2 z-20 w-[100%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/12 bg-[#617862]/55 backdrop-blur-xl p-7 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] lg:w-[70%]">
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-70" />

                  <div className="relative">
                    <p className="font-[AeonikArabic] text-white/80 text-xs tracking-[0.16em] uppercase">
                      your safe-food operating system
                    </p>

                    <h3 className="mt-3 font-[AeonikArabic] font-semibold text-[1.55rem] sm:text-[1.8rem] leading-[1.1]">
                      Less second-guessing.
                      <br />
                      More confidence.
                    </h3>

                    <p className="mt-3 font-[AeonikArabic] text-white/85 text-[1.02rem] leading-relaxed">
                      A system that helps you discover meals, verify products, and build habits —
                      around your exact restrictions.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
                      <Link
                        href="/system"
                        className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-[#8EB397] px-6 py-3 font-[AeonikArabic] font-medium text-[#1f2a24] shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#3D4F46]"
                      >
                        Get Started
                      </Link>
                      <span className="font-[AeonikArabic] text-white/70 text-sm">
                        Free. No pricing. No traps.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle ring hint */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-50" />
              </div>
            </div>

            {/* RIGHT: Active detail panel */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur-xl p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                    {active.tag}
                  </p>
                  <span className="h-px flex-1 bg-white/10" />
                  <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/55">
                    active
                  </p>
                </div>

                <h3 className="mt-4 font-[AeonikArabic] text-[1.6rem] sm:text-[1.8rem] font-semibold leading-tight">
                  {active.title}
                </h3>

                <p className="mt-3 font-[AeonikArabic] text-white/85 text-[1.05rem] leading-relaxed">
                  {active.desc}
                </p>

                {active.metric ? (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/65">
                        {active.metric.label}
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold text-white">
                        {active.metric.value}
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        {active.metric.sub}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/65">
                        outcome
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold text-[#9DE7C5]">
                        more certainty
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        less cognitive load
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="mt-7 inline-flex items-center gap-2 text-sm font-[AeonikArabic] text-white/75">
                  <span className="h-[1px] w-7 bg-white/25" />
                  <span className="text-white/85">Hover the orbit to pause • tap nodes to explore</span>
                </div>
              </div>

              <p className="mt-6 text-center font-[AeonikArabic] text-white/80 text-lg sm:text-xl">
                Built to feel calm when food doesn&apos;t.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
