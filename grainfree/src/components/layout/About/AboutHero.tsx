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
   Shared helpers (same as home hero)
---------------------------------- */

type Tile = {
  kind: "image" | "video";
  src: string;
  alt?: string;
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
      />
    );
  }

  return (
    <Image
      src={tile.src}
      alt={tile.alt ?? "About tile"}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 50vw, 320px"
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
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={
        reduceMotion
          ? undefined
          : { rotateX: rx, rotateY: ry, x: tx, y: ty }
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

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#BFDFC7]">
      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-10">
        {/* Canvas — SAME HEIGHT LOGIC AS HOME HERO */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[680px]">
          {/* ---------------------------
              RIGHT MEDIA CLUSTER
          --------------------------- */}

          {/* Small tile */}
          <HoverTile className="absolute left-10 top-16 z-10">
            <div className="relative h-[450px] w-[400px] overflow-hidden bg-black/10">
              <Media tile={{ kind: "image", src: "/about/tile-1.jpg" }} />
            </div>
          </HoverTile>

          {/* Tall tile */}
          <HoverTile className="absolute left-[600px] top-32 z-[5]">
            <div className="relative h-[360px] w-[360px] overflow-hidden bg-black/10">
              <Media tile={{ kind: "image", src: "/about/tile-2.jpg" }} />
            </div>
          </HoverTile>

          {/* Wide tile */}
          <HoverTile className="absolute right-6 bottom-10 z-10">
            <div className="relative h-[300px] w-[420px] overflow-hidden bg-black/10">
              <Media tile={{ kind: "video", src: "/about/tile-3.mp4" }} />
            </div>
          </HoverTile>

          {/* ---------------------------
              WORDMARK — SAME SCALE
          --------------------------- */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
      </div>
    </section>
  );
}
