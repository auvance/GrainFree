"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export default function PageHelp() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      const { data, error } = await supabase.from("faqs").select("*").order("category");
      if (error) console.error(error);
      else setFaqs(data ?? []);
    }
    loadFaqs();
  }, []);

  // Filter faqs
  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce((acc, faq) => {
    (acc[faq.category] ||= []).push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const categories = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#8CA38E] to-[#67816A] text-white">
      <Header />

      {/* HERO */}
      <section
        aria-labelledby="help-hero-title"
        className=""
      >
        <div className="mx-auto max-w-[1040px] px-6 pt-[88px] pb-10 text-center">
          <h1
            id="help-hero-title"
            className="font-extrabold tracking-tight text-[64px] leading-[1.05] md:text-[96px]"
          >
            <span className="text-black/70">Grain</span>
            <span className="text-[#008509]">FreeHelp</span>
          </h1>

          <p className="mt-3 text-[15px] md:text-[16px] text-white/90">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* thin divider */}
          <hr className="mx-auto mt-6 w-[720px] max-w-full border-t border-white/50" />

          {/* search + ticket */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <label htmlFor="help-search" className="sr-only">
              Search for help articles
            </label>
            <input
              id="help-search"
              type="text"
              placeholder="Search for help articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-[520px] max-w-[75vw] rounded-full bg-white/90 px-5 py-3 text-[14px] text-gray-900 shadow-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="button"
              onClick={() =>
                (window.location.href = "mailto:support@grainfree.com?subject=Create%20Ticket")
              }
              className="rounded-full bg-white px-5 py-3 text-[13px] font-semibold text-gray-900 shadow hover:bg-gray-100"
            >
              Create Ticket
            </button>
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="mx-auto mt-16 max-w-4xl space-y-12 px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-[#3c5640] p-8 text-center text-white">
            <p className="text-lg font-medium">
              Your question is not available.
              <br />
              Write your question and we’ll answer you personally.
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <article key={category} className="rounded-lg bg-[#3c5640] p-8 text-white shadow">
              <h2 className="text-lg font-semibold">{category}</h2>
              <ul className="mt-4 divide-y divide-gray-600">
                {grouped[category].map((faq) => (
                  <li key={faq.id} className="py-2">
                    <button
                      className="flex w-full items-center justify-between py-3 text-left text-base"
                      aria-expanded={openId === faq.id}
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    >
                      <span>{faq.question}</span>
                      <span className="ml-2 text-gray-300">
                        {openId === faq.id ? "−" : "+"}
                      </span>
                    </button>

                    {/* answer slides, line moves down */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        openId === faq.id ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-gray-200 py-2">{faq.answer}</p>
                    </div>
                    <div
                      className={`border-t border-gray-500 transition-all duration-500 ease-in-out ${
                        openId === faq.id ? "mt-2" : "mt-0"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </section>

      <Footer />
    </main>
  );
}
