"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Tile = {
  kind: "image" | "video";
  src: string;
  alt?: string;
};

type Props = {
  // replace these with your real assets
  tile1?: Tile; // small left
  tile2?: Tile; // tall behind wordmark
  tile3?: Tile; // right top
  tile4?: Tile; // right bottom
};

/* -----------------------------
   Reveal choreography variants
------------------------------ */
const tileReveal = {
  hidden: {
    opacity: 0,
    y: 14,
    clipPath: "inset(0 0 100% 0)",
    scale: 0.985,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.12 + i * 0.12,
    },
  }),
};

const stickerReveal = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.72,
    },
  },
};

const canvasReveal = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
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
      alt={tile.alt ?? "Hero tile"}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 50vw, 320px"
      priority={false}
    />
  );
}

/** Independent hover tilt per tile (no shared container movement) */
function HoverTile({
  children,
  className,
  strength = 10,
}: {
  children: React.ReactNode;
  className: string;
  strength?: number;
}) {
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

    // ignore touch
    if (typeof window !== "undefined") {
      const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (isCoarse) return;
    }

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x);
    my.set(y);
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
      style={{
        rotateX: rx,
        rotateY: ry,
        x: tx,
        y: ty,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function GrainFreeWordmark({
  tile1 = { kind: "image", src: "/hero/tile-1.jpg", alt: "Tile 1" },
  tile2 = { kind: "image", src: "/hero/tile-2.jpg", alt: "Tile 2" },
  tile3 = { kind: "video", src: "/hero/tile-3.mp4", alt: "Tile 3" },
  tile4 = { kind: "image", src: "/hero/tile-4.jpg", alt: "Tile 4" },
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#FAFAF5]">
      {/* Optional subtle ambient (does NOT move tiles) */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#517F58]/10 blur-[120px]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.45, 0.65, 0.45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-260px] top-[15%] h-[560px] w-[560px] rounded-full bg-[#9DE7C5]/10 blur-[140px]"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-10">
        {/* Canvas (entire hero reveals in) */}
        <motion.div
          className="relative h-[420px] sm:h-[520px] lg:h-[680px]"
          variants={canvasReveal}
          initial="hidden"
          animate="show"
        >
          {/* ---------------------------
              TILE 1 — small (left)
          --------------------------- */}
          <HoverTile
            strength={8}
            className="absolute left-4 sm:left-8 lg:left-14 top-10 sm:top-14 lg:top-35 z-10"
          >
            <motion.div
              custom={0}
              variants={tileReveal}
              initial="hidden"
              animate="show"
              className="relative h-[150px] w-[150px] sm:h-[190px] sm:w-[190px] lg:h-[270px] lg:w-[220px] overflow-hidden bg-black/5"
            >
              <div className="absolute inset-0 bg-black/10" />
              <Media tile={tile1} />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
            </motion.div>
          </HoverTile>

          {/* ---------------------------
              TILE 2 — tall (left-mid)
              extends behind wordmark
          --------------------------- */}
          <HoverTile
            strength={10}
            className="absolute left-[190px] sm:left-[250px] lg:left-[305px] top-12 sm:top-14 lg:top-14 z-5"
          >
            <motion.div
              custom={1}
              variants={tileReveal}
              initial="hidden"
              animate="show"
              className="relative h-[240px] w-[140px] sm:h-[330px] sm:w-[170px] lg:h-[480px] lg:w-[300px] overflow-hidden bg-black/5"
            >
              <div className="absolute inset-0 bg-black/10" />
              <Media tile={tile2} />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
            </motion.div>
          </HoverTile>

          {/* ---------------------------
              RIGHT STACK — tile 3 + tile 4
          --------------------------- */}
          <div className="absolute right-4 sm:right-8 lg:right-14 top-12 sm:top-16 lg:top-16 z-10 flex items-end flex-col gap-7">
            <HoverTile strength={8} className="relative">
              <motion.div
                custom={2}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative h-[90px] w-[170px] sm:h-[120px] sm:w-[240px] lg:h-[180px] lg:w-[400px] overflow-hidden bg-black/5"
              >
                <div className="absolute inset-0 bg-black/10" />
                <Media tile={tile3} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              </motion.div>
            </HoverTile>

            <HoverTile strength={8} className="relative">
              <motion.div
                custom={3}
                variants={tileReveal}
                initial="hidden"
                animate="show"
                className="relative h-[105px] w-[170px] sm:h-[135px] sm:w-[240px] lg:h-[155px] lg:w-[340px] overflow-hidden bg-black/5"
              >
                <div className="absolute inset-0 bg-black/10" />
                <Media tile={tile4} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
              </motion.div>
            </HoverTile>
          </div>

          {/* ---------------------------
              STICKER — independent hover motion + reveal
          --------------------------- */}
          <HoverTile
            strength={6}
            className="absolute left-1/2 top-[140px] sm:top-[165px] lg:top-[175px] z-20 -translate-x-1/2"
          >
            <motion.div
              variants={stickerReveal}
              initial="hidden"
              animate="show"
              className="rounded bg-[#517F58] px-4 py-2 text-white drop-shadow-[6px_6px_0px_#3D4F46]"
            >
              <p className="text-[18px] leading-tight font-[AeonikArabic]">
                The No BS <span className="italic">&apos;Gluten Free&apos;</span>{" "}
                Guide.
              </p>
              <p className="text-[18px] leading-tight font-[AeonikArabic]">
                All in one, right in your pocket.
              </p>
            </motion.div>
          </HoverTile>

          {/* ---------------------------
              WORDMARK — on top
              Tile 2 runs behind this (z-5 vs z-30)
          --------------------------- */}
          <motion.h1
            className="absolute left-4 sm:left-8 lg:left-14 bottom-10 sm:bottom-12 lg:bottom-14 z-30 font-[AeonikArabic] font-bold leading-[0.85] tracking-tight text-[clamp(4.8rem,16vw,17rem)]"
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.95 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.85,
            }}
          >
            <span className="text-[#3D4F46]">Grain</span>
            <span className="relative inline-block text-[#008509]">Free</span>
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
