'use client'
import Header from "@/components/layout/Header/Header"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

function FeatureCard({
  title,
  desc,
  tag,
  col,
}: {
  title: string;
  desc: string;
  tag: string;
  col?: string;
}) {
  return (
    <div className={`${col ?? ""}`}>
      <div className="group relative overflow-hidden rounded-3xl border border-white/12 bg-[#617862]/45 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1">
        {/* micro shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-70" />
        {/* hover glow */}
        <div className="pointer-events-none absolute -inset-16 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
             style={{ background: "radial-gradient(circle, rgba(157,231,197,0.18), transparent 60%)" }}
        />

        <div className="relative p-7 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-[AeonikArabic] text-xs tracking-[0.16em] uppercase text-white/70">
              {tag}
            </p>
            <span className="h-2 w-2 rounded-full bg-[#9DE7C5]/90 shadow-[0_0_24px_rgba(157,231,197,0.45)]" />
          </div>

          <h3 className="mt-3 font-[AeonikArabic] text-[1.4rem] sm:text-[1.55rem] font-semibold leading-tight">
            {title}
          </h3>

          <p className="mt-3 font-[AeonikArabic] text-white/80 text-[1rem] sm:text-[1.05rem] leading-relaxed">
            {desc}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-[AeonikArabic] text-white/75">
            <span className="h-[1px] w-6 bg-white/25 transition-all duration-300 group-hover:w-10" />
            <span className="transition-colors duration-300 group-hover:text-white">
              Explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }
  
  return (
    <main className="bg-[#FAFAF5] rounded-xl">
    <Header/>
   
    <section className="">
      <div className="relative inline-block flex">
        {/* Tag */}
        <div className="| [@media(min-width:1400px)]:pt-100 | [@media(min-width:1500px)]:pt-140">
          <div className="absolute right-0 bottom-[-20] w-60">
            <div className="rounded bg-[#517F58] px-4 py-2 text-white drop-shadow-[6px_6px_0px_#3D4F46]">
              <p className="text-[12px] leading-tight font-[AeonikArabic]">
                The No BS <span className="italic">&apos;Allergen Free&apos;</span> Guide.
              </p>
              <p className="text-[12px] leading-tight font-[AeonikArabic]">
                All in one, right in your pocket.
              </p>
            </div>
          </div>
     
          {/* Heading */}
          <h1 className="text-[#3D4F46] text-[17rem] font-bold font-[AeonikArabic] | leading-[0.85] tracking-tight | pl-15 pb-15">
            Grain<span className="text-[#008509]">Free</span>
          </h1>
        </div>
      </div>
    </section>

    {/* Section 1  */}
    <section aria-labelledby="s1-title" className="bg-gradient-to-b from-[#67A871] to-[#517F58] text-white rounded-xl pb-70">
      
      <div className="mx-auto max-w-7xl px-10 py-30">

        {/* [0.5] Top copy: left headline, right helper text */}
        <div className="flex items-center justify-between">
          <h2 id="s1-title" className="text-[34px] leading-tight font-[AeonikArabic]">
            <span className="font-semibold">Struggling with <i className="not-italic italic">Celiac Disease</i>?</span>
            <br />
            <span className="font-semibold italic text-[#153C28]">Not Anymore.</span>
          </h2>

          <p className="text-[1.1rem] text-right leading-snug text-white font-[AeonikArabic]">
            Tell us about your diet, and<br /> we&apos;ll build your starting plan
          </p>
        </div>

        {/* [0.5] Main content */}
        <article className="mt-45 flex items-end gap-10 justify-center">
          <div>
            <div>
              <Image src="/image/rec1.png" width={500} height={500} alt="Picture of the author"/>
            </div>
          </div>

          <div className="w-150">
            <p className="text-[1.7rem] font-normal font-[AeonikArabic]">Choose your goals, allergies, food preferences, schedule & everything else that&apos;s important.</p>
            <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">Tell us about your diet.</p>
            <span>
                <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">1</h2>
            </span>
          </div>
          
        </article>
      </div>
      
    {/* Section 2  */}
      <section className="mx-auto w-200 mt-55">
        <div>
          <article className="flex flex-col gap-2">
            <div>
              <div>
                <Image src="/image/rec2.png" width={800} height={500} alt="Picture of the author"/>
              </div>
            </div>

          <div className="flex flex-row-reverse justify-end items-center gap-7">
            <div className="w-150">
              <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">Let our system build for you.</p>
              <p className="text-[1.5rem] font-normal font-[AeonikArabic]">Our AI-enhanced guide maps out your starter plan; products, 
                meals, and routines built around you.</p>
            </div>
            <div>
              <span>
                  <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">2</h2>
              </span>
            </div>
          </div>

          </article>
        </div>
      </section>


      {/* Section 3 */}
      <section className="mx-auto w-250 mt-75 ">
        <div>
          <article className="flex flex-col gap-10 items-end">
              <div className="flex flex-row items-end gap-5">
                <div>
                  <Image src="/image/Rec3.png" width={1200} height={500} alt="Picture of the author"/>
                </div>
                <div>
                  <span>
                    <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">3</h2>
                  </span>
                </div>
              </div>

              <div>
                <div className="text-right w-150">
                  <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">Let our system build for you.</p>
                  <p className="text-[1.5rem] font-normal font-[AeonikArabic]">Our AI-enhanced guide maps out your starter plan; products, 
                    meals, and routines built around you.</p>
                </div>
              </div>

          </article>
        </div>
        
      </section>
    </section>


    <section className="relative overflow-hidden bg-[#475845] text-white">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/10 blur-[110px]" />
        <div className="absolute -bottom-56 right-[-120px] h-[640px] w-[640px] rounded-full bg-[#9DE7C5]/12 blur-[120px]" />
        <div className="absolute left-[-180px] top-[20%] h-[520px] w-[520px] rounded-full bg-black/20 blur-[120px]" />
      </div>

      {/* Noise overlay (optional but Awwwardsy) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"300\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"300\" height=\"300\" filter=\"url(%23n)\" opacity=\"0.6\"/></svg>')",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28">
        {/* Typography moment */}
        <header className="text-center">
          <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.18em] uppercase">
            built for real people, real restrictions
          </p>

          <h2 className="mt-4 font-[AeonikArabic] font-bold text-[2.4rem] sm:text-[3.2rem] lg:text-[3.6rem] leading-[1.05]">
            It&apos;s not just a <span className="italic">&apos;Guide&apos;</span>
          </h2>

          <p className="font-[AeonikArabic] mt-4 text-[1.1rem] sm:text-[1.4rem] text-white/85">
            Everything Grainless does is built around one question:
          </p>

          <p className="font-[AeonikArabic] mt-2 text-[1.2rem] sm:text-[1.55rem] italic text-white/85">
            &quot;What would&apos;ve helped me when I was struggling?&quot;
          </p>
        </header>

        {/* Interactive Bento */}
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          className="relative mt-14 sm:mt-16 lg:mt-20"
          style={
            {
              // CSS vars used in spotlight
              ["--mx" as string]: "50%",
              ["--my" as string]: "40%",
            } as React.CSSProperties
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* HERO CARD */}
            <div className="lg:col-span-7 lg:row-span-2">
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#617862]/55 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                {/* spotlight */}
                <div className="pointer-events-none absolute inset-0 opacity-80"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mx) var(--my), rgba(157,231,197,0.22), transparent 55%)",
                  }}
                />
                {/* edge highlight */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-70" />

                <div className="relative p-8 sm:p-10">
                  <p className="font-[AeonikArabic] text-white/80 text-sm tracking-[0.16em] uppercase">
                    your safe-food operating system
                  </p>

                  <h3 className="mt-4 font-[AeonikArabic] font-semibold text-[2rem] sm:text-[2.35rem] leading-[1.08]">
                    Less second-guessing.
                    <br />
                    More confidence.
                  </h3>

                  <p className="mt-4 font-[AeonikArabic] text-white/85 text-[1.05rem] sm:text-[1.15rem] leading-relaxed max-w-[52ch]">
                    GrainFree isn&apos;t a list of &quot;maybe safe&quot; foods. It&apos;s a system that helps you
                    discover meals, verify products, and build habits — around your exact
                    restrictions.
                  </p>

                  {/* "fake UI" visual anchor */}
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/70">
                        today
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold">
                        1,842 kcal
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        macros + streaks + goals
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-[AeonikArabic] text-xs tracking-[0.14em] uppercase text-white/70">
                        safety
                      </p>
                      <p className="mt-2 font-[AeonikArabic] text-lg font-semibold text-[#9DE7C5]">
                        flags detected
                      </p>
                      <p className="mt-1 font-[AeonikArabic] text-white/70 text-sm">
                        allergens + labels
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <Link
                      href="/system"
                      className="inline-flex items-center justify-center rounded-xl border border-white/18 bg-[#8EB397] px-7 py-4 font-[AeonikArabic] font-medium text-[#1f2a24] shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#3D4F46]"
                    >
                      Get Started
                    </Link>
                    <span className="font-[AeonikArabic] text-white/70 text-sm">
                      Free. No pricing. No traps.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature card 1 */}
            <FeatureCard
              col="lg:col-span-5"
              title="Save your favorites"
              desc="Bookmark meals + products so your &apos;safe list&apos; grows with you."
              tag="personal library"
            />

            {/* Feature card 2 */}
            <FeatureCard
              col="lg:col-span-5"
              title="Filter by goals"
              desc="Gain weight, eat clean, budget-friendly — find what fits fast."
              tag="instant clarity"
            />

            {/* Feature card 3 */}
            <FeatureCard
              col="lg:col-span-6"
              title="Dietary flags built-in"
              desc="Lactose-free, nut-free, soy-free… labeled so you stop guessing."
              tag="trust layer"
            />

            {/* Feature card 4 */}
            <FeatureCard
              col="lg:col-span-6"
              title="Constantly evolving"
              desc="Smarter filters, better meals, more products — regularly improved."
              tag="living product"
            />
          </div>
        </div>

        {/* Bottom line (optional; keep it tight) */}
        <div className="mt-16 text-center">
          <p className="font-[AeonikArabic] text-white/80 text-lg sm:text-xl">
            Built to feel calm when food doesn&apos;t.
          </p>
        </div>
      </div>
    </section>

    <Footer/>
    </main>
  );
}
