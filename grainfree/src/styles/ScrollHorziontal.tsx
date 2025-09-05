"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { x: 0 },
        {
          x: "-400vw", // 5 panels → 100vw * 4
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${window.innerWidth * 5}`,
            scrub: 0.6,
            pin: true,
          },
        }
      );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  const panels = [
    {
      id: 1,
      title: "Why I Built GrainFree",
      text: [
        "This site wasn’t built by a company.",
        "It was built by someone who lived it.",
      ],
      button: "Get Started",
    },
    {
      id: 2,
      title: "For People Like You",
      text: [
        "✓ Eat better without confusion",
        "✓ Gain weight on a gluten-free diet",
        "✓ Feel like yourself again",
      ],
    },
    {
      id: 3,
      title: "Built With Care",
      text: [
        "Real food, real tools.",
        "A guide I wish I had when I needed it most.",
      ],
    },
    {
      id: 4,
      title: "Always Free",
      text: [
        "No pricing. No spam.",
        "Just tools that actually help.",
      ],
    },
    {
      id: 5,
      title: "Your Journey",
      text: [
        "Bookmark meals and products.",
        "Filter by goals.",
        "Track progress with confidence.",
      ],
    },
  ];

  return (
    <section className="overflow-hidden">
      <div ref={triggerRef}>
        <div
          ref={sectionRef}
          className="flex h-screen w-[200vw] flex-row relative"
        >
          {panels.map((panel) => (
            <div
              key={panel.id}
              className="h-screen w-screen flex items-center justify-center px-12 relative"
            >
              {/* Big number on the side */}
              <div className="relative left-12 top-1/2 -translate-y-1/2 text-[10rem] font-extrabold text-[#3D4F46] opacity-20 select-none">
                {panel.id}
              </div>

              {/* Main Card */}
              <div className="w-200 h-[80vh] rounded-2xl bg-white p-12 border border-gray-200 flex flex-col justify-between">
                {/* Title */}
                <h2 className="text-4xl font-bold text-[#3D4F46] mb-6">
                  {panel.title}
                </h2>

                {/* Text content */}
                <div className="flex-grow flex flex-col justify-center space-y-4">
                  {panel.text.map((line, idx) => (
                    <p key={idx} className="text-lg text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Optional button */}
                {panel.button && (
                  <button className="self-start mt-6 rounded-lg bg-[#008509] px-6 py-3 text-white font-semibold shadow hover:bg-green-700 transition">
                    {panel.button}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
