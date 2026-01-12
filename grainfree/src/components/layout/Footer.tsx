import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1B251E] px-6 sm:px-10 py-12 sm:py-14 lg:py-16">
      {/* Top Message */}
      <section className="flex flex-col items-center text-center">
        <div className="text-white font-bold italic font-[AeonikArabic] text-lg sm:text-2xl">
          <p>Built for the ones figuring it out.</p>
          <p>Not for project — for progress.</p>
        </div>

        {/* Main Logo */}
        <div className="text-[#3D4F46] text-center mt-8 sm:mt-10 mb-10 sm:mb-12">
          <h2 className="font-bold font-[AeonikArabic] leading-[0.9] text-5xl sm:text-7xl lg:text-9xl">
            Grain<span className="text-[#008509]">Free</span>
          </h2>
        </div>
      </section>

      {/* Divider */}
      <hr className="border-t border-gray-700 mx-auto w-full max-w-7xl mb-8 sm:mb-10" />

      {/* Nav + Copyright */}
      <section className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10 text-[#658273] font-normal font-[AeonikArabic]">
          <Link href="/system" prefetch className="hover:text-white transition">
            Get Started
          </Link>

          <Link href="/privacy" prefetch className="hover:text-white transition">
            Privacy Policy
          </Link>

          <Link href="/donate" prefetch className="hover:text-white transition">
            Donate ❥
          </Link>

          <Link href="/terms" prefetch className="hover:text-white transition">
            Terms & Conditions
          </Link>

          <Link
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            Github
          </Link>

          <Link href="/help" prefetch className="hover:text-white transition">
            Help Center
          </Link>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[#658273] font-normal font-[AeonikArabic] text-sm sm:text-base">
          <p>@GrainFree 2025. All Rights Reserved</p>
          <p className="opacity-80">Built with care ✦</p>
        </div>
      </section>
    </footer>
  );
}
