"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LeafIcon from "/public/LeafLogo.svg";
import UserProfileTwo from "@/components/ui/UserProfileTwo";
import { useAuth } from "@/components/providers/AuthProvider";

function cn(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { href: "/system", label: "Get Started" },
      { href: "/dash", label: "Dashboard" },
      { href: "/grainhub", label: "GrainFreeHub" },
      { href: "/about", label: "Learn More" },
      { href: "/help", label: "Help" },
    ],
    []
  );

  // ESC closes + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // sizes used for positioning the panel below header
  const headerTopMargin = 16; // mt-4
  const headerHeight = 64; // h-16
  const panelTop = headerTopMargin + headerHeight + 16; // header + little gap

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-[100]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={cn(
              "rounded-b-2xl",
              "bg-white/55 backdrop-blur-xl",
              "border border-black/10",
              "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
              "supports-[backdrop-filter]:bg-white/45"
            )}
          >
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                {/* Profile on mobile - left side */}
                <div className="sm:hidden">
                  <UserProfileTwo user={user} loading={loading} />
                </div>

                <Link href="/" className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-semibold tracking-tight text-[#12241A]">
                    Grain<span className="text-[#009B3E] font-[AeonikArabic]">Free</span>
                  </span>
                  <span className="h-px w-10 bg-black/10" />
                </Link>

                <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#12241A]">
                  {navLinks.map((link) => {
                    const active =
                      pathname === link.href ||
                      (link.href !== "/" && pathname?.startsWith(link.href));

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "relative py-2 transition-colors font-[AeonikArabic]",
                          active ? "text-[#009B3E]" : "hover:text-[#009B3E]",
                          "after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:rounded-full after:bg-[#009B3E] after:transition-all after:duration-300",
                          active ? "after:w-full" : "after:w-0 hover:after:w-full"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 ">
                <div className="hidden sm:block">
                  <UserProfileTwo user={user} loading={loading} />
                </div>

                {/* LEAF = OPEN/CLOSE (always on top) */}
                <button
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  className={cn(
                    "relative z-[120]",
                    "w-10 h-10",
                    "rounded-full",
                    "grid place-items-center",
                    "transition",
                    "border border-black/10",
                    menuOpen
                      ? "bg-white/80 shadow-md"
                      : "bg-white/40 hover:bg-white/70",
                    "active:scale-[0.98]"
                  )}
                >
                  <Image
                    src={LeafIcon}
                    alt="Menu"
                    className={cn(
                      "w-6 h-6",
                      "transition-transform duration-300 ease-out",
                      menuOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-full",
                      "ring-1 ring-transparent transition",
                      menuOpen && "ring-[#009B3E]/30"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BACKDROP (click to close) */}
      <div
        className={cn(
          "fixed inset-0 z-[90] transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
      </div>

      {/* SLIDE PANEL (starts BELOW the header so it doesn't look broken) */}
      <aside
        style={{ top: panelTop }}
        className={cn(
          "fixed right-4 sm:right-6 z-[95]",
          "h-[calc(100vh-120px)]",
          "w-[88%] max-w-[420px]",
          "rounded-2xl",
          "bg-[#0E1513] text-white",
          "border border-white/10",
          "shadow-2xl",
          "overflow-hidden",
          "transition-transform duration-300 ease-out",
          "font-[AeonikArabic]",
          menuOpen ? "translate-x-0" : "translate-x-[110%]"
        )}
        aria-hidden={!menuOpen}
      >
        <div className="h-full flex flex-col">
          {/* Panel top */}
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-wider">
              Navigation
            </p>
            <h3 className="text-lg font-semibold mt-1">
              Quick Menu
            </h3>
          </div>

          {/* Links */}
          <nav className="px-5 py-5 flex flex-col gap-3">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "group flex items-center justify-between",
                    "rounded-2xl px-4 py-4",
                    "border border-white/10",
                    "transition",
                    active ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <span className="text-base font-medium">{link.label}</span>
                  <span className="text-white/50 group-hover:text-white transition">
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto px-5 pb-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-white/80">
                Tip: Click outside to close.
              </p>
              <p className="text-xs text-white/50 mt-1">
                © {new Date().getFullYear()} GrainFree
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
