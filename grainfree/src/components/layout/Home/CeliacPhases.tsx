"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease },
  },
};

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function StoryBlock({
  step,
  kicker,
  title,
  body,
  imageSrc,
  imageAlt,
  flip = false,
  priority = false,
}: {
  step: string;
  kicker: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  flip?: boolean;
  priority?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.55 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
    >
      {/* COPY */}
      <div
        className={cn(
          "lg:col-span-5",
          flip ? "order-1 lg:order-2" : "order-1 lg:order-1"
        )}
      >
        <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/65">
          {kicker}
        </p>

        <div className="mt-4 inline-flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-white/10 backdrop-blur-xl">
            <span className="font-[AeonikArabic] text-[12px] tracking-[0.16em] text-white/85">
              {step}
            </span>
          </span>

          <span className="h-px w-10 bg-white/18" />
          <span className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/55">
            Step
          </span>
        </div>

        <h3 className="mt-5 font-[AeonikArabic] text-[2rem] sm:text-[2.2rem] font-semibold leading-[1.05] text-white">
          {title}
        </h3>

        <p className="mt-4 font-[AeonikArabic] text-white/85 text-[1.05rem] sm:text-[1.1rem] leading-relaxed max-w-[52ch]">
          {body}
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-[AeonikArabic] text-white/75">
          <span className="h-[1px] w-7 bg-white/25" />
          <span className="text-white/85">Clear, calm, and repeatable</span>
        </div>
      </div>

      {/* MEDIA */}
      <div
        className={cn(
          "lg:col-span-7 relative overflow-hidden rounded-3xl border border-white/12 bg-white/8 backdrop-blur-xl",
          "shadow-[0_30px_90px_rgba(0,0,0,0.1)]",
          flip ? "order-2 lg:order-1" : "order-2 lg:order-2"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-80" />
        <div className="relative h-[260px] sm:h-[320px] lg:h-[380px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover opacity-[0.96]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={priority}
          />
        </div>

        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />

        {/* Corner stamp */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/20 px-3 py-2 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#9DE7C5]/90 shadow-[0_0_22px_rgba(157,231,197,0.1)]" />
          <span className="font-[AeonikArabic] text-[11px] tracking-[0.18em] uppercase text-white/75">
            {kicker}
          </span>
        </div>
      </div>
    </motion.div>
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

      {/* Subtle grain */}
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
              how it works
            </p>

            <h2
              id="s1-title"
              className="mt-3 font-[AeonikArabic] text-[2.1rem] sm:text-[2.55rem] lg:text-[2.9rem] leading-[1.1]"
            >
              <span className="font-semibold">Struggling with</span>

              {/* Allergen swipe */}
              <span className="relative ml-3 inline-flex h-[1.15em] overflow-hidden align-baseline">
                <motion.span
                  className="block font-semibold italic text-white"
                  initial={{ y: "0%" }}
                  animate={{ y: ["0%", "-100%", "-200%", "0%"] }}
                  transition={{
                    duration: 6.5,
                    ease,
                    times: [0, 0.33, 0.66, 1],
                    repeat: Infinity,
                    repeatDelay: 0.9,
                  }}
                >
                  <span className="block h-[1.15em]">Celiac Disease?</span>
                  <span className="block h-[1.15em]">Nut Allergies?</span>
                  <span className="block h-[1.15em]">Lactose Intolerance?</span>
                </motion.span>

                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-transparent via-white/14 to-transparent blur-md"
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: ["-120%", "120%"], opacity: [0, 1] }}
                  transition={{
                    duration: 1.1,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 5.3,
                  }}
                />
              </span>

              <br />
              <span className="font-semibold italic text-[#153C28]">
                Not Anymore.
              </span>
            </h2>
          </motion.div>

          {/* Promise — said ONCE */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="font-[AeonikArabic] text-white/85 text-[1.0rem] sm:text-[1.1rem] leading-snug lg:text-right max-w-[48ch]"
          >
            Start without second guessing. Set your safety baseline once — then
            discover food decisions you can trust.
          </motion.p>
        </div>

        {/* One-time supporting statement (also only once) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="mt-10 sm:mt-12 rounded-3xl border border-white/14 bg-white/8 backdrop-blur-xl p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/65">
                a calm system
              </p>
              <p className="mt-2 font-[AeonikArabic] text-white/85 text-[1.05rem] leading-relaxed max-w-[72ch]">
                GrainFree turns your restrictions into a repeatable workflow:
                capture what matters, generate a starter plan, then discover
                meals and products with clear trust signals.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ul className="space-y-2">
                {["No confusion. No label scanning.", "Just progress you can trust."].map(
                  (t) => (
                    <li
                      key={t}
                      className="flex gap-3 font-[AeonikArabic] text-white/80"
                    >
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#9DE7C5]/90 shadow-[0_0_22px_rgba(157,231,197,0.1)]" />
                      <span>{t}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Narrative Flow Blocks (no PHASES array, no duplication) */}
        <div className="mt-12 sm:mt-14 lg:mt-16 space-y-14 sm:space-y-18">
          <StoryBlock
            step="01"
            kicker="Input"
            title="Tell us what’s safe for you"
            body="Share your diet, allergies, and preferences once. This becomes your safety baseline—every recommendation respects it."
            imageSrc="/image/rec1.png"
            imageAlt="Diet and allergen setup"
            priority
          />

          <StoryBlock
            step="02"
            kicker="Build"
            title="Get a starting plan you can trust"
            body="We generate a practical starter system—meals, products, and routines—designed around you, not generic advice."
            imageSrc="/image/rec2.png"
            imageAlt="Personalized plan"
            flip
          />

          <StoryBlock
            step="03"
            kicker="Run"
            title="Discover food with confidence"
            body="Search meals and products with trust signals, save what works, and build momentum—without decision fatigue or doubt."
            imageSrc="/image/Rec3.png"
            imageAlt="Product and meal discovery"
          />
        </div>
      </div>
    </section>
  );
}
