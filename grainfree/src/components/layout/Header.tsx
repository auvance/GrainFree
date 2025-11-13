"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LeafIcon from "/public/LeafLogo.svg";
import { useUser } from "@supabase/auth-helpers-react"; // ✅ inside component
import { supabase } from "@/lib/supabaseClient";
import { LogIn, UserCircle } from "lucide-react"; // icons
import { useAuth } from "../providers/AuthProvider";
import UserProfile from "@/components/ui/UserProfile";


export default function Header() {
  const { user, loading } = useAuth(); // ✅ inside component
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
        
          <div>
            <nav className="flex flex-row items-center [@media(min-width:1400px)]:gap-7 [@media(min-width:1500px)]:gap-20 pr-8 pl-8 bg-[#ffffff3d] text-[#4A4A4A] font-normal font-[AeonikArabic] border-1 border-[#E6E6E6] rounded-xl">
              
              <Link href="/system" className="p-3 hover:text-black transition" prefetch>Get Started</Link>
              <Link href="/dash" className="p-3 hover:text-black transition" prefetch>Dashboard</Link>
              <Link href="/grainhub" className="p-3 hover:text-black transition" prefetch>GrainFreeHub</Link>
              <Link href="/about" className="p-3 hover:text-black transition" prefetch>Learn More</Link>
              <Link href="/help" className="p-3 hover:text-black transition" prefetch>Help Center</Link>
              {/* Profile/Login Icon */}
              <UserProfile user={user} loading={loading} />
              
            </nav>
          </div>

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
            className="top-5 right-5 z-30">
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
