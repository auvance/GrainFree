"use client";

import React, { ReactNode, useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutStorySection.tsx
 * - Single file “personal story” section
 * - Smooth, one-time scroll reveal (no looping)
 * - Alternating rhythm + chapter blocks
 * - Safe for strings/ReactNodes
 */

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

type StoryBeat = {
  id: string;
  eyebrow?: string;
  title: string;
  bg: string; // tailwind class e.g. "bg-[#9ABF9E]"
  imageSrc: string;
  imageAlt: string;
  align?: "left" | "right"; // copy alignment (desktop)
  paragraphs: Array<string | ReactNode>;
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
};

const mediaReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.985, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.85, ease },
  },
};

function BeatCard({
  beat,
  index,
}: {
  beat: StoryBeat;
  index: number;
}) {
  const reduce = useReducedMotion();
  const flip = beat.align === "right"; // right-aligned copy (desktop)
  const isEven = index % 2 === 0;

  return (
    <section
      aria-label={beat.title}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-black/10",
        beat.bg
      )}
    >
      {/* soft atmosphere (no loop) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/25 blur-[120px]" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-black/10 blur-[140px]" />
      </div>

      {/* grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"260\" height=\"260\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"260\" height=\"260\" filter=\"url(%23n)\" opacity=\"0.55\"/></svg>')",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-18">
        {/* “chapter” strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className={cn(
            "inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/35 backdrop-blur-xl px-4 py-2",
            "font-[AeonikArabic]"
          )}
        >
          <span className="text-[11px] tracking-[0.22em] uppercase text-[#2a3b33]/70">
            Chapter
          </span>
          <span className="h-1 w-1 rounded-full bg-[#2a3b33]/35" />
          <span className="text-[12px] tracking-[0.16em] uppercase text-[#2a3b33]/80">
            {String(index + 1).padStart(2, "0")}
          </span>

          {beat.eyebrow ? (
            <>
              <span className="h-1 w-1 rounded-full bg-[#2a3b33]/30" />
              <span className="text-[12px] text-[#2a3b33]/75">{beat.eyebrow}</span>
            </>
          ) : null}
        </motion.div>

        {/* content grid */}
        <div
          className={cn(
            "mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center"
          )}
        >
          {/* MEDIA */}
          <motion.div
            variants={reduce ? fadeUp : mediaReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.55 }}
            className={cn(
              "lg:col-span-6",
              // alternate media side for rhythm (but keep copy alignment control)
              isEven ? "lg:order-1" : "lg:order-2"
            )}
          >
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-black/10 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 to-transparent opacity-80" />
              <div className="relative h-[240px] sm:h-[320px] lg:h-[420px]">
                <Image
                  src={beat.imageSrc}
                  alt={beat.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>

              {/* bottom legibility */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

              {/* corner “stamp” */}
              <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-md">
                <p className="font-[AeonikArabic] text-[11px] tracking-[0.18em] uppercase text-white/80">
                  {beat.title}
                </p>
              </div>
            </div>
          </motion.div>

          {/* COPY */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.55 }}
            className={cn(
              "lg:col-span-6",
              isEven ? "lg:order-2" : "lg:order-1"
            )}
          >
            <div className={cn("font-[AeonikArabic]", flip ? "lg:text-right" : "lg:text-left")}>
              <h3 className="text-[#1f2a24] font-bold leading-[1.02] text-[clamp(1.9rem,3.6vw,3.1rem)]">
                {beat.title}
              </h3>

              <div className={cn("mt-6 space-y-5 sm:space-y-6", flip ? "lg:ml-auto" : "")}>
                {(beat.paragraphs ?? []).map((p, i) => (
                  <motion.p
                    key={i}
                    initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.6, ease, delay: 0.06 + i * 0.08 }}
                    className="text-[#1f2a24]/80 leading-relaxed text-[1.02rem] sm:text-[1.08rem] max-w-[62ch]"
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* subtle “progress” bar */}
              <div className={cn("mt-8 flex items-center gap-3", flip && "lg:justify-end")}>
                <span className="h-[1px] w-10 bg-[#1f2a24]/25" />
                <span className="text-[#1f2a24]/55 text-sm tracking-[0.14em] uppercase">
                  keep going
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function AboutStorySection() {
  const beats = useMemo<StoryBeat[]>(
    () => [
      {
        id: "surviving",
        eyebrow: "before the diagnosis",
        title: "From Surviving to Building Again",
        bg: "bg-[#BFDFC7]",
        imageSrc: "/image/Rec4.png",
        imageAlt: "From surviving to building again",
        align: "left",
        paragraphs: [
          "Before celiac, I was gaining muscle, eating well, finally feeling strong. But after one vacation, everything changed.",
          "What started as food poisoning turned into fatigue, rapid weight loss, panic attacks, and months of confusion. No answers. Just frustration, anxiety, and feeling like I was slipping further away from who I was.",
        ],
      },
      {
        id: "diagnosis",
        eyebrow: "the spiral",
        title: "The Diagnosis Journey",
        bg: "bg-[#B6D9BE]",
        imageSrc: "/image/Rec5.png",
        imageAlt: "Diagnosis journey",
        align: "right",
        paragraphs: [
          <>
            I tried to go back to my old routine, eating more, pushing through, but nothing worked.
            Every meal ended in fatigue, vomiting, anxiety, and eventually panic attacks. I was nearly diagnosed with PTSD.
          </>,
          <>
            I saw doctors. Took pills. Still, nothing. Two years later, I was finally diagnosed with{" "}
            <span className="italic font-bold">celiac disease</span>.
          </>,
        ],
      },
      {
        id: "healing",
        eyebrow: "rebuilding trust",
        title: "Healing Took More Than a Diagnosis",
        bg: "bg-[#AED4B6]",
        imageSrc: "/image/Rec6.png",
        imageAlt: "Healing",
        align: "right",
        paragraphs: [
          "I was relieved, but also crushed. I couldn’t eat what I used to. I couldn’t trust labels. And figuring out what was safe felt like a full-time job.",
          "With the help of my mom, we researched everything — snacks, ingredients, hidden gluten sources. It was long, exhausting, and overwhelming. But we made it work.",
        ],
      },
      {
        id: "recovery",
        eyebrow: "alhamdulillah",
        title: "Recovery (and Clarity)",
        bg: "bg-[#A1C9AB]",
        imageSrc: "/image/Rec6.png",
        imageAlt: "Recovery",
        align: "left",
        paragraphs: [
          "I fasted for a month during Ramadan. I stayed strictly gluten-free. And I finally started gaining weight again.",
          <>
            My energy came back. My mind was clear.{" "}
            <span className="font-semibold">No fatigue. No panic.</span> Alhamdulillah.
          </>,
        ],
      },
    ],
    []
  );

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-16">
        {/* Section heading (optional but “product-grade”) */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <p className="font-[AeonikArabic] text-[#1f2a24]/60 text-sm tracking-[0.22em] uppercase">
            the story
          </p>
          <h2 className="mt-3 font-[AeonikArabic] font-bold leading-[1.02] text-[#1f2a24] text-[clamp(2.0rem,4.2vw,3.4rem)]">
            Why GrainFree exists
          </h2>
          <p className="mt-4 font-[AeonikArabic] text-[#1f2a24]/75 max-w-[70ch] text-[1.02rem] sm:text-[1.08rem] leading-relaxed">
            This isn’t branding copy. It’s the path that turned confusion into a system.
          </p>
        </motion.header>

        <div className="space-y-6 sm:space-y-8">
          {beats.map((b, i) => (
            <BeatCard key={b.id} beat={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
