'use client'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

import Button from '@/components/ui/button'

export default function HomePage() {
  return (
  
    <main className="min-h-screen bg-gradient-to-b from-[#67A871] to-[#517F58]">
      <Header/>

    <section className="pt-145 bg-[#FAFAF5] rounded-xl">
      <div className="relative inline-block">
        {/* Tag */}
        <div className="">
          <div className="absolute right-0 -top-8">
          <div className="rounded bg-[#517F58] px-4 py-2 text-white drop-shadow-[6px_6px_0px_#3D4F46]">
            <p className="text-[12px] leading-tight font-[AeonikArabic]">
              The No BS <span className="italic">'Allergen Free'</span> Guide.
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

      <section
      aria-labelledby="s1-title"
      className="bg-gradient-to-b from-[#67A871] to-[#517F58] text-white"
    >
      <div className="mx-auto max-w-7xl px-10 py-20">

        {/* Top copy: left headline, right helper text */}
        <header className="flex items-start justify-between">
          <h2 id="s1-title" className="text-[34px] leading-tight font-[AeonikArabic]">
            <span className="font-semibold">Struggling with <i className="not-italic italic">Celiac Disease</i>?</span>
            <br />
            <span className="font-semibold italic text-white/90">Not Anymore.</span>
          </h2>

          <p className="max-w-[220px] text-[12px] leading-snug text-white/80">
            Tell us about your diet, and<br /> we’ll build your starting plan
          </p>
        </header>

        {/* Main content */}
        <article className="mt-14 grid grid-cols-12 gap-10 items-start">
          {/* Left: image/illustration placeholder */}
          <div className="col-span-5">
            <div
              aria-hidden="true"
              className="aspect-[3/4] rounded-xl bg-white/20 backdrop-blur-[1px] shadow-inner"
            />
          </div>

          {/* Right: description + emphasis + big step number */}
          <div className="col-span-7 relative">
            <p className="max-w-[520px] text-[14px] leading-relaxed text-white/90">
              Choose your goals, allergies, food preferences, schedule & everything else
              that’s important.
            </p>

            <p className="mt-4 font-semibold italic text-white">
              Tell us about your diet.
            </p>

            {/* Big step number pinned near the bottom */}
            <span className="pointer-events-none absolute -bottom-8 left-0 text-[140px] leading-none font-extrabold text-white/90 select-none">
              1
            </span>
          </div>
        </article>
      </div>
    </section>


      

      <Footer/>
      
    </main>
  )
}
