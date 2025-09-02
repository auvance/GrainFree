"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LeafIcon from "/public/LeafLogo.svg";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const user = useUser(); // ✅ inside component
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close overlay on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close overlay on ESC key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      <header className="flex justify-between items-center mr-8 ml-8 pt-8">
        {/* Left nav links */}
        
          
        <nav className="flex flex-row gap-20 pr-8 pl-8 bg-[#ffffff3d] text-[#4A4A4A] font-normal font-[AeonikArabic] border-1 border-[#E6E6E6] rounded-xl">
          <Link href="/system" className="p-3">Get Started</Link>
          <Link href="/dash" className="p-3">Dashboard</Link>
          <Link href="/grainhub" className="p-3">GrainFreeHub</Link>
          <Link href="/about" className="p-3">Learn More</Link>
          <Link href="/help" className="p-3">Help Center</Link>
          
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden"
            >
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 rounded-full" />
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black/10">
                <ul className="py-2 text-sm font-[AeonikArabic] text-gray-800">
                  <li>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => supabase.auth.signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Right side text + icons */}
        <div className="flex flex-row gap-10 items-center">
          <p className="text-black font-normal font-[AeonikArabic]">
            You're <span className="font-semibold">one</span> decision away<br />
            from <span className="text-[#1DA1C9] font-semibold">changing your life.</span>
          </p>

          {/* Profile Icon */}
          

          {/* Leaf Icon Hamburger Menu */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="top-5 right-5 z-30"
          >
            <Image
              src={LeafIcon}
              alt="Menu"
              className={`block w-20 h-auto transform transition-transform duration-300 ease-out 
                ${open ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-20 transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto bg-black/60"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Overlay Panel */}
      <div
        className={`fixed top-4 right-4 bottom-4 z-20 transition-transform duration-300 ease-out
          ${open ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 pointer-events-none"}`}
      >
        <div className="relative h-full w-200 rounded-xl border border-white/10 bg-[#3D4F46] text-[#E6EDE9] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 h-full">
            {/* Left nav */}
            <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16">
              <ul className="w-full max-w-xl space-y-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/system", label: "Get Started" },
                  { href: "/about", label: "Learn More" },
                  { href: "/dash", label: "Dashboard" },
                  { href: "/help", label: "Help Center" },
                ].map((item) => (
                  <li key={item.href} className="group">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block pb-2 text-3xl md:text-4xl lg:text-5xl font-[AeonikArabic]"
                    >
                      {item.label}
                    </Link>
                    <div className="h-px w-full bg-white/30 group-hover:bg-white/60 transition" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: links bottom-right */}
            <div className="relative px-8 py-8">
              <div className="absolute bottom-6 right-8 space-y-2 text-xs md:text-sm text-[#C9D3CF] text-right">
                <Link href="https://github.com" className="block hover:text-white transition" onClick={() => setOpen(false)}>Github</Link>
                <Link href="/donate" className="block hover:text-white transition" onClick={() => setOpen(false)}>Donate</Link>
                <Link href="/privacy" className="block hover:text-white transition" onClick={() => setOpen(false)}>Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white transition" onClick={() => setOpen(false)}>Terms & Condition</Link>
                <p className="pt-2 text-[11px] opacity-80">@GrainFree 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
