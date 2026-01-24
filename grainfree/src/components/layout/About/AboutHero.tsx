"use client";


import React from "react";
// If you want the same independent hover tilt you already use on home,
// reuse HoverTile + Media from your GrainFreeWordmark component.

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#BFDFC7]">


      {/* WORDMARK (exactly your sizing) */}
      <div className="relative z-10">
        <section className="">
          <div className="relative inline-block flex">
            {/* Tag */}
            <div className="| [@media(min-width:1400px)]:pt-75 | [@media(min-width:1500px)]:pt-85">
              {/* Heading */}
              <h2 className="text-[#3D4F46] | [@media(min-width:1400px)]:text-[7rem] [@media(min-width:1500px)]:text-[11rem] | font-bold font-[AeonikArabic] leading-[0.85] tracking-tight pl-15">
                Why I built
              </h2>
              <h1 className="text-[#3D4F46] | [@media(min-width:1400px)]:text-[12rem] [@media(min-width:1500px)]:text-[17rem] | font-bold font-[AeonikArabic] | leading-[0.85] tracking-tight | pl-15 pb-15">
                Grain<span className="text-[#008509]">Free</span>
              </h1>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
