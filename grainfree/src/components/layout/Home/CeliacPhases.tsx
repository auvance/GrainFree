"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const mediaIn = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

type Phase = {
  n: string;
  kicker: string;
  title: string;
  desc: string;
  mediaSrc: string;
  mediaAlt: string;
};

const PHASES: Phase[] = [
  {
    n: "01",
    kicker: "Input",
    title: "Tell us about your diet",
    desc: "Choose your goals, allergies, food preferences, schedule — everything that matters to you.",
    mediaSrc: "/image/rec1.png",
    mediaAlt: "Diet setup",
  },
  {
    n: "02",
    kicker: "Build",
    title: "Let our system build for you",
    desc: "Our AI-enhanced guide maps out your starter plan — products, meals, and routines built around you.",
    mediaSrc: "/image/rec2.png",
    mediaAlt: "System build",
  },
  {
    n: "03",
    kicker: "Run",
    title: "Discover with confidence",
    desc: "Search meals + products with trust signals, save what works, and build momentum without decision fatigue.",
    mediaSrc: "/image/Rec3.png",
    mediaAlt: "Discovery",
  },
];

function PhaseNode({ n, active = false }: { n: string; active?: boolean }) {
  return (
    <div className="relative flex items-center gap-4">
      <div
        className={[
          "relative grid place-items-center",
          "h-11 w-11 rounded-full border",
          "backdrop-blur-xl",
          active
            ? "border-white/30 bg-white/15"
            : "border-white/18 bg-black/10",
        ].join(" ")}
      >
        <span className="font-[AeonikArabic] text-[13px] tracking-[0.14em] text-white/90">
          {n}
        </span>

        {/* tiny glow */}
        <span
          aria-hidden="true"
          className={[
            "absolute -inset-3 rounded-full blur-xl opacity-0",
            active ? "opacity-60" : "opacity-0",
          ].join(" ")}
          style={{
            background:
              "radial-gradient(circle, rgba(157,231,197,0.18), transparent 60%)",
          }}
        />
      </div>

      <div className="h-px flex-1 bg-white/15" />
    </div>
  );
}

export default function CeliacPhases() {
  return (
    <section
      aria-labelledby="s1-title"
      className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#67A871] to-[#517F58] text-white"
    >
      {/* Atmosphere (non-loop) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-white/10 blur-[110px]" />
        <div className="absolute -bottom-56 left-[-140px] h-[640px] w-[640px] rounded-full bg-black/20 blur-[120px]" />
        <div className="absolute right-[-180px] top-[22%] h-[540px] w-[540px] rounded-full bg-[#9DE7C5]/10 blur-[120px]" />
      </div>

      {/* subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"300\" height=\"300\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16 py-14 sm:py-18 lg:py-22">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.18em] uppercase">
              phases
            </p>

            <h2
              id="s1-title"
              className="mt-3 font-[AeonikArabic] text-[2.1rem] sm:text-[2.55rem] lg:text-[2.9rem] leading-[1.1]"
            >
              <span className="font-semibold">Struggling with</span>

              {/* Allergen vertical swipe / reveal (reliable px-based) */}
              <span className="relative ml-3 inline-flex h-[1.15em] overflow-hidden align-baseline">
  <motion.span
    className="block font-semibold italic text-white"
    initial={{ y: "0%" }}
    animate={{ y: ["0%", "-100%", "-200%", "0%"] }}
    transition={{
      duration: 6.5,               // overall cycle length (slow + premium)
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.33, 0.66, 1],   // each allergen “stop” point
      repeat: Infinity,
      repeatDelay: 0.9,            // pause at the end before looping
    }}
  >
    <span className="block h-[1.15em]">Celiac Disease?</span>
    <span className="block h-[1.15em]">Nut Allergies?</span>
    <span className="block h-[1.15em]">Lactose Intolerance?</span>
  </motion.span>

  {/* optional soft sweep every loop (subtle, not chaotic) */}
  <motion.span
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-transparent via-white/14 to-transparent blur-md"
    initial={{ x: "-120%", opacity: 0 }}
    animate={{ x: ["-120%", "120%"], opacity: [0, 1] }}
    transition={{
      duration: 1.1,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: 5.3, // sync-ish with main loop (duration - sweep duration)
    }}
  />
</span>

             

              <br />
              <span className="font-semibold italic text-[#153C28]">
                Not Anymore.
              </span>
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="font-[AeonikArabic] text-white/85 text-[1.0rem] sm:text-[1.1rem] leading-snug lg:text-right max-w-[46ch]"
          >
            Tell us about your diet — we&apos;ll build your starting plan.
            <br />
            Clear phases. No overwhelm.
          </motion.p>
        </div>

        {/* Phase Rail Layout */}
        <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Rail */}
          <div className="lg:col-span-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[22px] top-14 bottom-3 w-px bg-white/15" />

              <div className="space-y-8">
                {PHASES.map((p, i) => (
                  <motion.div
                    key={p.n}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative"
                  >
                    <PhaseNode n={p.n} active={i === 0} />

                    <div className="mt-4 pl-16">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                        {p.kicker}
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-[1.15rem] sm:text-[1.25rem] font-semibold">
                        {p.title}
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-white/80 text-[0.98rem] sm:text-[1.05rem] leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <div className="lg:col-span-8 space-y-10 sm:space-y-12">
            {PHASES.map((p, i) => {
              const flip = i % 2 === 1;

              return (
                <motion.div
                  key={p.n}
                  variants={mediaIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.55 }}
                  className={[
                    "relative overflow-hidden",
                    "rounded-3xl border border-white/12",
                    "bg-white/8 backdrop-blur-xl",
                    "shadow-[0_30px_90px_rgba(0,0,0,0.22)]",
                  ].join(" ")}
                >
                  {/* soft highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-80" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Media */}
                    <div
                      className={[
                        "relative",
                        "lg:col-span-7",
                        "min-h-[220px] sm:min-h-[280px] lg:min-h-[330px]",
                        flip ? "lg:order-2" : "lg:order-1",
                      ].join(" ")}
                    >
                      <Image
                        src={p.mediaSrc}
                        alt={p.mediaAlt}
                        fill
                        className="object-cover opacity-[0.95]"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority={i === 0}
                      />

                      {/* gradient legibility */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* number badge */}
                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/20 px-3 py-2 backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-[#9DE7C5]/90 shadow-[0_0_22px_rgba(157,231,197,0.5)]" />
                        <span className="font-[AeonikArabic] text-[11px] tracking-[0.18em] uppercase text-white/75">
                          Phase {p.n}
                        </span>
                      </div>
                    </div>

                    {/* Copy */}
                    <div
                      className={[
                        "lg:col-span-5 p-6 sm:p-8 lg:p-10",
                        flip ? "lg:order-1" : "lg:order-2",
                      ].join(" ")}
                    >
                      <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/65">
                        {p.kicker}
                      </p>
                      <h3 className="mt-3 font-[AeonikArabic] text-[1.5rem] sm:text-[1.7rem] font-semibold leading-tight">
                        {p.title}
                      </h3>
                      <p className="mt-3 font-[AeonikArabic] text-white/85 text-[1.05rem] leading-relaxed">
                        {p.desc}
                      </p>

                      {/* tiny CTA line */}
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-[AeonikArabic] text-white/75">
                        <span className="h-[1px] w-7 bg-white/25" />
                        <span className="text-white/85">Continue</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 sm:mt-14" />
      </div>
    </section>
  );
}
