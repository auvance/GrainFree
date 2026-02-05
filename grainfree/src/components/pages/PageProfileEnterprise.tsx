"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header/Header";

// ✅ Adjust these imports to match your project paths
import PageProfileAccount from "@/components/profiles/PageProfileAccount";
import PageProfilePreferences from "@/components/profiles/PageProfilePreference";
import PageProfileSecurity from "@/components/profiles/PageProfileSecurity";

type TabId = "home" | "account" | "preferences" | "security";

type Category = {
  id: Exclude<TabId, "home">;
  label: string;
  description?: string;
  badge?: string;
};

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121816] p-5 sm:p-6 lg:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/45">
          Settings
        </p>
        <h2 className="mt-2 font-[AeonikArabic] text-xl sm:text-2xl font-semibold text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 font-[AeonikArabic] text-white/55 text-sm sm:text-[0.98rem] leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>

      {children}
    </div>
  );
}

export default function PageProfileEnterprise() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>("home");

  // --- Swipe state (mobile only) ---
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const categories: Category[] = useMemo(
    () => [
      {
        id: "account",
        label: "Profile",
        description: "Email, username, and personal details.",
      },
      {
        id: "preferences",
        label: "Diet & Allergens",
        description: "Global rules applied across Hub + AI + products.",
        badge: "Global",
      },
      {
        id: "security",
        label: "Security",
        description: "Password, OAuth, and account protection.",
      },
    ],
    []
  );

  const activeLabel =
    active === "home"
      ? "Settings"
      : categories.find((c) => c.id === active)?.label ?? "Settings";

  const renderContent = () => {
    switch (active) {
      case "account":
        return (
          <SectionShell title="Profile" subtitle="Manage your identity and basic account details.">
            <PageProfileAccount />
          </SectionShell>
        );
      case "preferences":
        return (
          <SectionShell
            title="Diet & Allergens"
            subtitle="These rules become your default safety layer across GrainFree."
          >
            <PageProfilePreferences />
          </SectionShell>
        );
      case "security":
        return (
          <SectionShell title="Security" subtitle="Keep your account protected and in your control.">
            <PageProfileSecurity />
          </SectionShell>
        );
      default:
        return null;
    }
  };

  // App-level back behavior:
  // - If inside a category => go back to Settings Home
  // - If on Settings Home => go back to previous app page
  function handleBack() {
    if (active === "home") {
      router.back(); // or router.push("/dashboard") if you want deterministic
      return;
    }
    setActive("home");
  }

  function computeTranslatePercent(): number {
    const base = active === "home" ? 0 : -50;
    if (!containerRef.current) return base;

    const w = containerRef.current.getBoundingClientRect().width || 1;
    const extra = active === "home" ? 0 : Math.min(50, Math.max(0, (dragPx / w) * 50));
    return base + extra;
  }

  function onTouchStart(e: React.TouchEvent) {
    // only swipe-back from detail
    if (active === "home") return;
    if (e.touches.length !== 1) return;

    startXRef.current = e.touches[0].clientX;
    draggingRef.current = true;
    setIsDragging(true);
    setDragPx(0);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!draggingRef.current) return;
    if (active === "home") return;

    const startX = startXRef.current;
    if (startX == null) return;

    const x = e.touches[0].clientX;
    const dx = x - startX;

    // only allow swipe-right (back)
    if (dx <= 0) {
      setDragPx(0);
      return;
    }

    setDragPx(dx);
  }

  function onTouchEnd() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    if (!containerRef.current) {
      setDragPx(0);
      return;
    }

    const w = containerRef.current.getBoundingClientRect().width || 1;
    const threshold = Math.max(90, w * 0.18);

    if (dragPx >= threshold) {
      setActive("home");
    }

    setDragPx(0);
    startXRef.current = null;
  }

  const translatePct = computeTranslatePercent();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <Header />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* MOBILE */}
        <div className="md:hidden">
          {/* Mobile top bar */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={cn(
                "inline-flex items-center justify-center rounded-xl",
                "border border-white/10 bg-white/5 backdrop-blur-xl",
                "h-10 w-10 text-white/85",
                "active:scale-[0.98]"
              )}
              aria-label={active === "home" ? "Back" : "Back to settings"}
            >
              <BackIcon />
            </button>

            <div className="text-center">
              <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/55">
                Settings
              </p>
              <p className="font-[AeonikArabic] text-[1.05rem] font-semibold text-white">
                {activeLabel}
              </p>
            </div>

            <div className="h-10 w-10" />
          </div>

          {/* Sliding navigator */}
          <div
            ref={containerRef}
            className="relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <div
              className={cn(
                "flex w-[200%]",
                isDragging ? "transition-none" : "transition-transform duration-300 ease-out"
              )}
              style={{ transform: `translateX(${translatePct}%)` }}
            >
              {/* Panel 1: Settings Home */}
              <div className="w-1/2 pr-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
                  <h1 className="font-[AeonikArabic] text-2xl font-semibold text-[#00B84A]">
                    Settings
                  </h1>
                  <p className="mt-1 font-[AeonikArabic] text-sm text-white/55">
                    Manage your profile, diet rules, and security.
                  </p>

                  <div className="mt-5">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActive(c.id)}
                          className={cn(
                            "w-full text-left rounded-xl",
                            "px-4 py-4",
                            "transition active:scale-[0.99]",
                            "hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="mt-[2px] h-2.5 w-2.5 rounded-full bg-[#00B84A]/85 shadow-[0_0_20px_rgba(0,184,74,0.35)]" />

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-[AeonikArabic] text-[1.05rem] font-semibold text-white">
                                  {c.label}
                                </p>
                                {c.badge ? (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-[AeonikArabic] text-white/60">
                                    {c.badge}
                                  </span>
                                ) : null}
                              </div>
                              {c.description ? (
                                <p className="mt-1 font-[AeonikArabic] text-sm text-white/50 leading-snug">
                                  {c.description}
                                </p>
                              ) : null}
                            </div>

                            <span className="text-white/35">
                              <ChevronRight />
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <p className="mt-4 font-[AeonikArabic] text-xs text-white/35">
                      Tip: Diet & allergens apply across Hub + AI + products.
                    </p>
                  </div>
                </div>
              </div>

              {/* Panel 2: Category Detail */}
              <div className="w-1/2 pl-3">
                {renderContent()}

                {active !== "home" ? (
                  <p className="mt-4 text-center font-[AeonikArabic] text-xs text-white/35">
                    Swipe right to go back
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP/TABLET (unchanged behavior) */}
        <div className="hidden md:flex gap-8">
          <aside className="w-80 lg:w-[340px] shrink-0">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
              <h1 className="font-[AeonikArabic] text-2xl font-semibold text-[#00B84A]">
                Settings
              </h1>
              <p className="mt-1 font-[AeonikArabic] text-sm text-white/55">
                Manage your profile, diet rules, and security.
              </p>

              <nav className="mt-6 space-y-2">
                {categories.map((c) => {
                  const isActive = active === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActive(c.id)}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-4 text-left transition",
                        isActive
                          ? "border-[#00B84A]/35 bg-[#00B84A] text-black"
                          : "border-white/10 bg-black/20 text-white/85 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p
                            className={cn(
                              "font-[AeonikArabic] font-semibold",
                              isActive ? "text-black" : "text-white"
                            )}
                          >
                            {c.label}
                          </p>
                          {c.description ? (
                            <p
                              className={cn(
                                "mt-1 font-[AeonikArabic] text-sm",
                                isActive ? "text-black/70" : "text-white/45"
                              )}
                            >
                              {c.description}
                            </p>
                          ) : null}
                        </div>
                        {c.badge ? (
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-[11px] font-[AeonikArabic]",
                              isActive
                                ? "bg-black/10 text-black"
                                : "bg-white/5 text-white/60 border border-white/10"
                            )}
                          >
                            {c.badge}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </nav>

              <p className="mt-5 font-[AeonikArabic] text-xs text-white/35">
                Tip: Diet & allergens apply across Hub + AI + products.
              </p>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {active === "home" ? (
              <SectionShell
                title="Settings"
                subtitle="Choose a category on the left to manage your account."
              >
                <div className="font-[AeonikArabic] text-white/70">
                  Select a category to begin.
                </div>
              </SectionShell>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
