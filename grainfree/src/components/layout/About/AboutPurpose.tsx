"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type Tile = {
  kind: "image" | "video";
  src: string;
  alt?: string;
  className?: string; // optional extra positioning classes
};

type Props = {
  title?: string;
  subtitle?: string;
  empathyLine?: string;
  bullets?: string[];
  ctaTitle?: string;
  ctaHref?: string;
  tiles?: Tile[];
};

function Media({ tile }: { tile: Tile }) {
  if (tile.kind === "video") {
    return (
      <video
        className="h-full w-full object-cover"
        src={tile.src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={tile.src}
      alt={tile.alt ?? "Media"}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 520px"
      priority={false}
    />
  );
}

/** Independent hover tilt (per tile, not the whole container) */
function HoverTile({
  children,
  className,
  strength = 10,
}: {
  children: React.ReactNode;
  className: string;
  strength?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 220, damping: 20, mass: 0.25 });
  const sy = useSpring(my, { stiffness: 220, damping: 20, mass: 0.25 });

  const rx = useTransform(sy, [-0.5, 0.5], [strength, -strength]);
  const ry = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const tx = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const ty = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  function onMove(e: React.MouseEvent) {
    if (reduceMotion || !ref.current) return;

    // ignore touch pointers
    if (typeof window !== "undefined") {
      const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (isCoarse) return;
    }

    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        reduceMotion
          ? undefined
          : { rotateX: rx, rotateY: ry, x: tx, y: ty, transformStyle: "preserve-3d" }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -----------------------------
   Motion
------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

export default function WhyBuiltSection({
  title = "This is why I built",
  subtitle = "This site wasn’t built by a company. It was built by someone who lived it.",
  empathyLine = "Someone who struggled to figure it out — and wants to make sure you don’t have to go through that alone.",
  bullets = [
    "People trying to eat better without confusion",
    "Those struggling to gain weight on a gluten-free diet",
    "Anyone just trying to feel like themselves again",
    "and everyone in between",
  ],
  ctaTitle = "Get Started",
  ctaHref = "/system",
  tiles = [
    { kind: "image", src: "/about/why-1.jpg", alt: "Safe food choices" },
    { kind: "image", src: "/about/why-2.jpg", alt: "Reading labels" },
    { kind: "video", src: "/about/why-3.mp4", alt: "Meal prep" },
    { kind: "image", src: "/about/why-4.jpg", alt: "Gluten-free lifestyle" },
  ],
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#517F58]">
      {/* soft atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-white/12 blur-[120px]" />
        <div className="absolute -bottom-56 left-[-220px] h-[640px] w-[640px] rounded-full bg-black/25 blur-[140px]" />
        <div className="absolute right-[-240px] top-[18%] h-[560px] w-[560px] rounded-full bg-[#9DE7C5]/12 blur-[140px]" />
      </div>

      {/* subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"300\" height=\"300\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 text-white">
        {/* Top headline + media */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Copy */}
          <motion.div
            className="lg:col-span-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
          >
            <motion.p
              variants={fadeUp}
              className="font-[AeonikArabic] text-white/70 text-xs uppercase tracking-[0.18em]"
            >
              why
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-3 font-[AeonikArabic] font-bold leading-[0.95] tracking-tight text-[clamp(2.2rem,6vw,4.2rem)]"
            >
              <span className="text-white/90">{title}</span>{" "}
              <span className="text-[#9DE7C5]">Grain</span>
              <span className="text-white">Free</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-[AeonikArabic] text-white/85 text-[1.05rem] sm:text-[1.15rem] leading-relaxed max-w-[52ch]"
            >
              {subtitle}
            </motion.p>

            {/* empathy bridge card */}
            <motion.div
              variants={fadeUp}
              className="mt-7 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.1)]"
            >
              <p className="font-[AeonikArabic] text-white/90 text-[1.05rem] sm:text-[1.15rem] leading-relaxed">
                {empathyLine}
              </p>
              <div className="mt-4 flex items-center gap-3 text-white/75 text-sm font-[AeonikArabic]">
                <span className="h-[1px] w-10 bg-white/25" />
                <span>Made for real life, not perfection.</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Media cluster */}
          <motion.div
            className="lg:col-span-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={stagger}
          >
            <div className="relative">
              {/* “canvas” */}
              <div className="relative h-[340px] sm:h-[420px] lg:h-[520px]">
                {/* tile A (top-right) */}
                <HoverTile className="absolute right-0 top-0 z-10" strength={8}>
                  <motion.div
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/10 ring-1 ring-black/10
                               h-[120px] w-[220px]
                               sm:h-[150px] sm:w-[280px]
                               lg:h-[170px] lg:w-[320px]"
                  >
                    <Media tile={tiles[0]} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                </HoverTile>

                {/* tile B (mid-right, wide) */}
                <HoverTile className="absolute right-14 top-[120px] sm:top-[150px] z-[6]" strength={10}>
                  <motion.div
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/10 ring-1 ring-black/10
                               h-[160px] w-[320px]
                               sm:h-[190px] sm:w-[420px]
                               lg:h-[220px] lg:w-[520px]"
                  >
                    <Media tile={tiles[1]} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                </HoverTile>

                {/* tile C (bottom-right, tall-ish) */}
                <HoverTile className="absolute right-0 bottom-0 z-10" strength={9}>
                  <motion.div
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/10 ring-1 ring-black/10
                               h-[150px] w-[260px]
                               sm:h-[190px] sm:w-[340px]
                               lg:h-[240px] lg:w-[420px]"
                  >
                    <Media tile={tiles[2]} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                </HoverTile>

                {/* tile D (accent, bottom-left of cluster) */}
                <HoverTile className="absolute left-0 bottom-10 sm:bottom-12 z-[4]" strength={7}>
                  <motion.div
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 ring-1 ring-black/10
                               h-[110px] w-[170px]
                               sm:h-[140px] sm:w-[220px]
                               lg:h-[170px] lg:w-[260px]"
                  >
                    <Media tile={tiles[3]} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                </HoverTile>
              </div>

              {/* small label tag */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/15 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#9DE7C5] shadow-[0_0_18px_rgba(157,231,197,0.1)]" />
                <span className="text-xs tracking-[0.18em] uppercase text-white/75 font-[AeonikArabic]">
                  built with empathy
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: who it's for + CTA */}
        <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Bullets */}
          <motion.div
            className="lg:col-span-7"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
          >
            <motion.p
              variants={fadeUp}
              className="font-[AeonikArabic] text-white/70 text-sm"
            >
              <span className="italic text-white/90">GrainFree</span> is for:
            </motion.p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bullets.map((b) => (
                <motion.div
                  key={b}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/14 bg-white/10 backdrop-blur-xl px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-[6px] h-2 w-2 rounded-full bg-[#9DE7C5]" />
                    <p className="font-[AeonikArabic] text-white/90 leading-relaxed">
                      {b}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="lg:col-span-5"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div
              variants={fadeUp}
              className="rounded-3xl border border-white/16 bg-black/15 backdrop-blur-xl p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
            >
              <p className="font-[AeonikArabic] text-white/90 text-[1.05rem] sm:text-[1.12rem] leading-relaxed">
                There&apos;s no pricing, no spam, no BS. Just real food, smart tools,
                and a guide I wish I had when I needed it most.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-2xl bg-white text-[#153C28] px-5 py-3 font-[AeonikArabic] font-semibold
                             hover:opacity-90 transition"
                >
                  {ctaTitle}
                </Link>

                <div className="text-white/65 text-sm font-[AeonikArabic]">
                  Takes 2 minutes to start.
                </div>
              </div>
            </motion.div>

            {/* micro note */}
            <motion.p
              variants={fadeUp}
              className="mt-4 text-white/55 text-xs font-[AeonikArabic]"
            >
              You&apos;re one decision away from feeling in control again.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
