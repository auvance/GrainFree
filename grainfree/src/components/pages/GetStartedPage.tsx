"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GetStartedPage() {
  const router = useRouter();

  useEffect(() => {
    // Gate: only logged-in users can access
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/auth");
    });
  }, [router]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-[#475845] px-6 py-16">
      <section className="w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-10 text-white">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-widest text-white/70">Welcome to GrainFree</p>
          <h1 className="text-3xl font-bold mt-2">Ready to build your personalized gluten-free guide?</h1>
        </header>

        <p className="text-white/80">
          We’ll ask a few questions about your goals, restrictions, and preferences. At the end, we’ll use AI to build a plan just for you.
        </p>

        <div className="mt-8">
          <Link
            href="/build"
            className="inline-flex items-center rounded-lg bg-[#008509] hover:bg-green-700 px-6 py-3 font-semibold"
            prefetch
          >
            Start
          </Link>
        </div>
      </section>
    </main>
  );
}
