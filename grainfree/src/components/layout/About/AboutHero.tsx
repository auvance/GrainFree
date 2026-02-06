"use client";

import Image from "next/image";
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ---------------------------------
   Shared helpers (same behavior as home hero)
---------------------------------- */

type Tile = {
  kind: "image" | "video";
  src: string;
  alt?: string;
};

type Props = {
  tile1?: Tile; // small
  tile2?: Tile; // tall
  tile3?: Tile; // wide
};

/* -----------------------------
   One-time reveal choreography
------------------------------ */
const canvasReveal = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const tileReveal = {
  hidden: { opacity: 0, y: 14, clipPath: "inset(0 0 100% 0)", scale: 0.985 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.12 + i * 0.12,
    },
  }),
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
      alt={tile.alt ?? "About tile"}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 520px"
      priority={false}
    />
  );
}

/** Independent hover tilt — identical behavior */
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
    const el = ref.current;
    if (!el) return;

    // ignore touch + reduced motion
    if (reduceMotion) return;
    if (typeof window !== "undefined") {
      const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (isCoarse) return;
    }

    const r = el.getBoundingClientRect();
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

/* ---------------------------------
   About Hero
---------------------------------- */

export default function AboutHero({
  tile1 = { kind: "image", src: "/about/tile-1.jpg", alt: "Tile 1" },
  tile2 = { kind: "image", src: "/about/tile-2.jpg", alt: "Tile 2" },
  tile3 = { kind: "video", src: "/about/tile-3.mp4", alt: "Tile 3" },
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#BFDFC7]">
      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-10">
        {/* =========================================================
            MOBILE + TABLET ( < lg )
            - Grid layout, no absolute chaos
            - Same assets + wordmark
           ========================================================= */}
        <motion.div
          variants={canvasReveal}
          initial="hidden"
          animate="show"
          className="block flex flex-col-reverse gap-10 lg:hidden py-10 sm:py-12"
        >
          {/* Media grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {/* tile2 big-ish */}
              <motion.div
                custom={0}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="col-span-2 relative overflow-hidden bg-black/5 rounded-2xl h-[240px] sm:h-[320px]"
              >
                <div className="absolute inset-0 bg-black/10" />
                <Media tile={tile2} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              </motion.div>

              {/* tile1 */}
              <motion.div
                custom={1}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative overflow-hidden bg-black/5 rounded-2xl h-[190px] sm:h-[240px]"
              >
                <div className="absolute inset-0 bg-black/10" />
                <Media tile={tile1} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              </motion.div>

              {/* tile3 */}
              <motion.div
                custom={2}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative overflow-hidden bg-black/5 rounded-2xl h-[190px] sm:h-[240px]"
              >
                <div className="absolute inset-0 bg-black/10" />
                <Media tile={tile3} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              </motion.div>
            </div>
          </div>

          {/* Wordmark below (responsive clamp, same type feel) */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.55 }}
            className="mt-10 sm:mt-12"
          >
            <h2 className="text-[#3D4F46] font-bold font-[AeonikArabic] leading-[0.9] tracking-tight text-[clamp(2.2rem,8.5vw,4.2rem)]">
              Why I built
            </h2>

            <h1 className="font-bold font-[AeonikArabic] leading-[0.85] tracking-tight text-[clamp(3.8rem,14vw,7.8rem)]">
              <span className="text-[#3D4F46]">Grain</span>
              <span className="text-[#008509]">Free</span>
            </h1>
          </motion.div>
        </motion.div>

        {/* =========================================================
            DESKTOP ( lg+ )
            - Your absolute canvas preserved (UNCHANGED)
           ========================================================= */}
        <motion.div
          variants={canvasReveal}
          initial="hidden"
          animate="show"
          className="hidden lg:block"
        >
          {/* Canvas — SAME HEIGHT LOGIC AS HOME HERO */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[680px]">
            {/* Small tile */}
            <HoverTile className="absolute left-10 top-16 z-10">
              <motion.div
                custom={0}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative h-[450px] w-[400px] overflow-hidden bg-black/10"
              >
                <Media tile={tile1} />
              </motion.div>
            </HoverTile>

            {/* Tall tile */}
            <HoverTile className="absolute left-[450px] top-32 z-[5]">
              <motion.div
                custom={1}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative h-[330px] w-[360px] overflow-hidden bg-black/10"
              >
                <Media tile={tile2} />
              </motion.div>
            </HoverTile>

            {/* Wide tile */}
            <HoverTile className="absolute left-[820px] bottom-40 z-10">
              <motion.div
                custom={2}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative h-[300px] w-[420px] overflow-hidden bg-black/10"
              >
                <Media tile={tile3} />
              </motion.div>
            </HoverTile>

            {/* WORDMARK — SAME SCALE */}
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
              className="absolute left-4 sm:left-8 lg:left-14 bottom-10 sm:bottom-12 lg:bottom-14 z-30"
            >
              <h2 className="text-[#3D4F46] font-bold font-[AeonikArabic] leading-[0.85] tracking-tight text-[clamp(2.6rem,8vw,7rem)]">
                Why I built
              </h2>

              <h1 className="font-bold font-[AeonikArabic] leading-[0.85] tracking-tight text-[clamp(4.8rem,16vw,17rem)]">
                <span className="text-[#3D4F46]">Grain</span>
                <span className="text-[#008509]">Free</span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
