    "use client";

    import React, { useEffect, useState, useMemo } from "react";
    import { supabase } from "@/lib/supabaseClient";
    import Header from "@/components/layout/Header/Header";
    import Footer from "@/components/layout/Footer";
    import { motion } from "framer-motion";

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
          else setFaqs((data ?? []) as FAQ[]);
        }
        loadFaqs();
      }, []);

      const filtered = useMemo(() => {
        if (!query.trim()) return faqs;
        return faqs.filter(
          (f) =>
            f.question.toLowerCase().includes(query.toLowerCase()) ||
            f.answer.toLowerCase().includes(query.toLowerCase())
        );
      }, [faqs, query]);

      const grouped = filtered.reduce((acc, faq) => {
        (acc[faq.category] ||= []).push(faq);
        return acc;
      }, {} as Record<string, FAQ[]>);

      const categories = Object.keys(grouped).sort();

      const easeOutExpo = [0.22, 1, 0.36, 1] as const;

      const fadeUp = {
        hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.65, ease: easeOutExpo },
        },
      };


      return (
        <main className="relative min-h-screen w-full bg-[#475845] text-white overflow-hidden">
          {/* Atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
            <div className="absolute -bottom-60 right-[-120px] h-[600px] w-[600px] rounded-full bg-[#9DE7C5]/15 blur-[140px]" />
            <div className="absolute left-[-200px] top-[30%] h-[520px] w-[520px] rounded-full bg-black/25 blur-[130px]" />
          </div>

          {/* Noise */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-overlay"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"280\" height=\"280\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"1.0\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"280\" height=\"280\" filter=\"url(%23n)\" opacity=\"0.5\"/></svg>')",
            }}
          />

          <Header />

          {/* HERO */}
          <section className="relative z-10">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-12 sm:pt-16 pb-6 text-center">
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="font-[AeonikArabic] font-extrabold leading-[0.92]
                  text-[2rem] sm:text-[4rem] lg:text-[5.2rem]"
              >
                <span className="text-[#3D4F46]">Grain</span>
                <span className="text-[#00B84A]">FreeHelp</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.15 }}
                className="mt-4 max-w-[42rem] mx-auto text-base sm:text-lg lg:text-xl
                  font-[AeonikArabic] text-white/85"
              >
                Everything you need to navigate GrainFree — answers, guidance, and personal support.
              </motion.p>

              {/* Search + CTA */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.25 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-3xl mx-auto"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full rounded-full px-6 py-3 text-gray-900 bg-white/90
                    border border-white/20 focus:ring-2 focus:ring-[#00B84A] outline-none
                    placeholder:text-gray-500 font-[AeonikArabic]"
                />

                <button
                  type="button"
                  onClick={() => (window.location.href = "mailto:support@grainfree.com")}
                  className="shrink-0 rounded-full px-6 py-3 bg-white text-gray-900 font-semibold 
                    border border-white/20 shadow-sm hover:bg-gray-100 transition font-[AeonikArabic]"
                >
                  Create Ticket
                </button>
              </motion.div>
            </div>
          </section>

          {/* FAQ LIST */}
          <section className="relative z-10 mx-auto max-w-[1000px] px-4 sm:px-8 pb-20 sm:pb-28 mt-6 sm:mt-12 space-y-10">
            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.1)]">
                <p className="text-lg font-[AeonikArabic] text-white/85">
                  No results found.
                  <br />
                  Try adjusting your question or reach out to support.
                </p>
              </div>
            ) : (
              categories.map((category, i) => (
                <motion.article
                  key={category}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 
                    p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.1)]"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#00B84A]/20 border border-[#00B84A]/30
                      px-3 py-1 text-xs font-[AeonikArabic] tracking-wide text-[#00B84A] uppercase">
                      {category}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* FAQ Items */}
                  <ul className="mt-4">
                    {grouped[category].map((faq) => {
                      const isOpen = openId === faq.id;
                      return (
                        <li key={faq.id} className="py-2 sm:py-3">
                          <button
                            onClick={() => setOpenId(isOpen ? null : faq.id)}
                            className="w-full flex items-start justify-between gap-4 text-left
                              font-[AeonikArabic] text-white/80 hover:text-white transition"
                          >
                            <span className="text-[1.05rem] sm:text-[1.2rem] font-semibold leading-tight">
                              {faq.question}
                            </span>
                            <span
                              className={`transition-transform text-xl ${isOpen ? "rotate-180" : ""}`}
                            >
                              +
                            </span>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="font-[AeonikArabic] text-white/60 text-sm sm:text-[1.05rem] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>

                          <div className="border-t border-white/10 mt-3" />
                        </li>
                      );
                    })}
                  </ul>
                </motion.article>
              ))
            )}
          </section>

          <Footer />
        </main>
      );
    }
      