"use client";

import { useEffect } from "react";
// @ts-expect-error no types
import LocomotiveScroll from "locomotive-scroll";


export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]") as HTMLElement,
      smooth: true,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return <div data-scroll-container>{children}</div>;
}
