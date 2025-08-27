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
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .order("category", { ascending: true });
  
        if (error) console.error(error);
        else setFaqs(data || []);
      }
      loadFaqs();
    }, []);
  
    // Filter by search
    const filtered = faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase())
    );
  
    // Group by category
    const grouped = filtered.reduce((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);
  
    const categories = Object.keys(grouped).sort();

    return (
        <main className="min-h-screen bg-[#FAFAF5]">
      <Header />

      {/* Search */}
      <section className="mx-auto mt-16 max-w-3xl px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-2 text-gray-600">Find answers to common questions</p>
        <input
          type="text"
          placeholder="Search FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-6 w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </section>

      {/* FAQs */}
      <section className="mx-auto mt-16 max-w-4xl space-y-12 px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-[#3c5640] p-8 text-center text-white">
            <p>Your question is not available. Write your question and we’ll answer you personally.</p>
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
                    <span className="ml-2 text-gray-400">{openId === faq.id ? "−" : "+"}</span>
                  </button>
                
                  {/* Animated container */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openId === faq.id ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm text-gray-200 py-2">{faq.answer}</p>
                  </div>
                
                  {/* The line always visible, but pushed down when open */}
                  <div
                    className={`border-t border-gray-500 transition-all duration-500 ease-in-out ${
                      openId === faq.id ? "mt-2" : "mt-0"
                    }`}
                  ></div>
                </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </section>

      <Footer />
    </main>
    )
  }
