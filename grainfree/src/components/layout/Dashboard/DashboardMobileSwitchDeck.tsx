"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

type PrimaryView = "today" | "dashboard";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full px-4 py-2 text-xs font-[AeonikArabic] transition border",
        active
          ? "bg-white/12 border-white/18 text-white"
          : "bg-white/6 border-white/10 text-white/70 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

/**
 * SwipeDeck
 * - Pure CSS scroll-snap horizontal pager (no deps)
 * - Keeps content in one vertical slot (no up/down scanning)
 */
function SwipeDeck({
  pages,
  initialIndex = 0,
  onIndexChange,
}: {
  pages: { key: string; title?: string; content: ReactNode }[];
  initialIndex?: number;
  onIndexChange?: (idx: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: idx * width, behavior: "smooth" });
  };

  // Keep scroll position aligned if container resizes (orientation change etc.)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => scrollToIndex(initialIndex));
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track active index (simple + robust)
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    onIndexChange?.(idx);
  };

  return (
    <div className="w-full">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className={cx(
          "flex w-full overflow-x-auto overflow-y-hidden",
          "scroll-smooth",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "snap-x snap-mandatory"
        )}
      >
        {pages.map((p) => (
          <div
            key={p.key}
            className="w-full shrink-0 snap-start px-0"
          >
            {p.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardMobileSwitchDeck({
  // TODAY pages
  todayMeals,
  todayStats,

  // DASHBOARD pages
  guidance,
  recommendations,
  library,

  defaultPrimary = "today",
}: {
  todayMeals: ReactNode;
  todayStats: ReactNode;

  guidance: ReactNode;
  recommendations: ReactNode;
  library: ReactNode;

  defaultPrimary?: PrimaryView;
}) {
  const [primary, setPrimary] = useState<PrimaryView>(defaultPrimary);

  const [todayIdx, setTodayIdx] = useState(0);
  const [dashIdx, setDashIdx] = useState(0);

  const todayPages = useMemo(
    () => [
      { key: "meals", title: "Meals", content: <div className="pt-4">{todayMeals}</div> },
      { key: "stats", title: "Stats", content: <div className="pt-4">{todayStats}</div> },
    ],
    [todayMeals, todayStats]
  );

  const dashPages = useMemo(
    () => [
      { key: "guidance", title: "Guidance", content: <div className="pt-4">{guidance}</div> },
      { key: "recs", title: "For you", content: <div className="pt-4">{recommendations}</div> },
      { key: "library", title: "Library", content: <div className="pt-4">{library}</div> },
    ],
    [guidance, recommendations, library]
  );

  const activeTitle =
    primary === "today"
      ? todayPages[todayIdx]?.title
      : dashPages[dashIdx]?.title;

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      {/* Top switch row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
            quick view
          </p>
          <div className="mt-1 font-[AeonikArabic] text-sm text-white/75">
            {primary === "today" ? "Today" : "Dashboard"}{" "}
            <span className="text-white/45">•</span>{" "}
            <span className="text-white/85">{activeTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TabButton active={primary === "today"} onClick={() => setPrimary("today")}>
            Today
          </TabButton>
          <TabButton active={primary === "dashboard"} onClick={() => setPrimary("dashboard")}>
            Dashboard
          </TabButton>
        </div>
      </div>

      {/* Swipe content (same vertical slot) */}
      <div className="mt-4">
        {primary === "today" ? (
          <SwipeDeck pages={todayPages} onIndexChange={setTodayIdx} />
        ) : (
          <SwipeDeck pages={dashPages} onIndexChange={setDashIdx} />
        )}
      </div>

      {/* Tiny hint */}
      <div className="mt-3 text-[11px] font-[AeonikArabic] text-white/45">
        Tip: swipe left/right to switch sections.
      </div>
    </section>
  );
}
