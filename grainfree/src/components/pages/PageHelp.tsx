"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/layout/Header/Header";
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
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("category");
      if (error) console.error(error);
      else setFaqs((data ?? []) as FAQ[]);
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
      <section aria-labelledby="help-hero-title">
        <div className="mx-auto max-w-[1040px] px-4 sm:px-6 py-10 sm:py-16 pb-8 sm:pb-10 text-center">
          <h1
            id="help-hero-title"
            className="font-extrabold font-[AeonikArabic] leading-[0.95]
              text-[3rem] sm:text-[4rem] lg:text-[5.5rem]"
          >
            <span className="text-[#3D4F46]">Grain</span>
            <span className="text-[#008509]">FreeHelp</span>
          </h1>

          <p
            className="font-[AeonikArabic] font-bold text-gray-600 mx-auto
              text-base sm:text-lg lg:text-[1.5rem]
              max-w-[42rem]"
          >
            Find answers to common questions or get in touch with our support team
          </p>

          {/* search + ticket */}
          <div
            className="mt-8 sm:mt-10 w-full max-w-3xl mx-auto
              flex flex-col sm:flex-row gap-3 sm:gap-4 font-[AeonikArabic]"
          >
            <label htmlFor="help-search" className="sr-only">
              Search for help articles
            </label>

            <input
              id="help-search"
              type="text"
              placeholder="Search for help articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full flex-1 rounded-full px-5 sm:px-6 py-3
                border border-[#708272]
                bg-white/90 text-gray-900 placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#009B3E]"
            />

            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "mailto:support@grainfree.com?subject=Create%20Ticket")
              }
              className="w-full sm:w-auto rounded-full bg-white border border-[#708272]
                px-5 py-3 text-[13px] font-semibold text-gray-900
                shadow hover:bg-gray-100 transition"
            >
              Create Ticket
            </button>
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="mx-auto mt-8 sm:mt-12 max-w-4xl space-y-8 sm:space-y-12 px-4 pb-16 sm:pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-[#3c5640] p-6 sm:p-8 text-center text-white">
            <p className="text-base sm:text-lg font-medium">
              Your question is not available.
              <br />
              Write your question and we’ll answer you personally.
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <article
              key={category}
              className="rounded-[20px] bg-[#586F5D] p-5 sm:p-8 text-white shadow"
            >
              <h2 className="font-[AeonikArabic] font-semibold text-lg sm:text-[1.5rem]">
                {category}
              </h2>

              <ul className="mt-3 sm:mt-4">
                {grouped[category].map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <li key={faq.id} className="py-1.5 sm:py-2">
                      <button
                        className="flex w-full items-start sm:items-center justify-between gap-4
                          py-3 text-left font-[AeonikArabic] font-semibold
                          text-white/70 hover:text-white transition
                          text-base sm:text-[1.15rem] lg:text-[1.3rem]"
                        aria-expanded={isOpen}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                      >
                        <span className="flex-1">{faq.question}</span>

                        <span className="shrink-0 text-gray-300 text-xl leading-none">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {/* answer */}
                      <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <p className="py-2 font-[AeonikArabic] text-white/50 text-sm sm:text-[1.05rem]">
                          {faq.answer}
                        </p>
                      </div>

                      <div
                        className={`border-t border-gray-500 transition-all duration-500 ease-in-out ${
                          isOpen ? "mt-2" : "mt-0"
                        }`}
                      />
                    </li>
                  );
                })}
              </ul>
            </article>
          ))
        )}
      </section>

      <Footer />
    </main>
  );
}
