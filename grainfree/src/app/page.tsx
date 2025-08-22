'use client'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Button from '@/components/ui/button'

export default function HomePage() {
  
  return (
    
    <main className="bg-[#FAFAF5] rounded-xl">
    <Header/>

    <section className="">
      <div className="relative inline-block flex">
        {/* Tag */}
        <div className="pt-125">
          <div className="relative left-0 -top-8 w-60">
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

    {/* Section 1  */}
    <section aria-labelledby="s1-title" className="bg-gradient-to-b from-[#67A871] to-[#517F58] text-white rounded-xl pb-70">
      
      <div className="mx-auto max-w-7xl px-10 py-20">

        {/* [0.5] Top copy: left headline, right helper text */}
        <div className="flex items-center justify-between">
          <h2 id="s1-title" className="text-[34px] leading-tight font-[AeonikArabic]">
            <span className="font-semibold">Struggling with <i className="not-italic italic">Celiac Disease</i>?</span>
            <br />
            <span className="font-semibold italic text-[#153C28]">Not Anymore.</span>
          </h2>

          <p className="text-[1.1rem] text-right leading-snug text-white font-[AeonikArabic]">
            Tell us about your diet, and<br /> we’ll build your starting plan
          </p>
        </div>

        {/* [0.5] Main content */}
        <article className="mt-30 flex items-end gap-10">
          <div>
            <div>
              <Image src="/image/rec1.png" width={500} height={500} alt="Picture of the author"/>
            </div>
          </div>

          <div>
            <p>Choose your goals, allergies, food preferences, schedule & everything else that’s important.</p>
            <p>Tell us about your diet.</p>
            <span>
                <h2>1</h2>
            </span>
          </div>
          
        </article>
      </div>

    {/* Section 2  */}
      <section className="mx-auto w-200 mt-75">
        <div>
          <article className="flex flex-col gap-10">
            <div>
              <div>
                <Image src="/image/rec2.png" width={800} height={500} alt="Picture of the author"/>
              </div>
            </div>

          <div className="flex flex-row-reverse justify-end items-center gap-5">
            <div>
              <p>Let our system build for you.</p>
              <p>Our AI-enhanced guide maps out your starter plan; products, 
                meals, and routines built around you.</p>
            </div>
            <div>
              <span>
                  <h2>2</h2>
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
                    <h2>3</h2>
                  </span>
                </div>
              </div>

              <div>
                <div>
                  <p>Let our system build for you.</p>
                  <p>Our AI-enhanced guide maps out your starter plan; products, 
                    meals, and routines built around you.</p>
                </div>
              </div>

          </article>
        </div>
        
      </section>
    </section>



    <section className="bg-[#475845] text-white">
      <div className="mx-auto w-full max-w-[1120px] px-16 pt-35 pb-40">

        {/* Title + subline */}
        <header className="text-center">
          <h2 className="font-[AeonikArabic] font-bold text-[3rem] leading-[1.15]">
            It’s not just a ‘Guide’
          </h2>
          <p className="mt-[10px] text-[1.5rem] leading-tight text-white/85">
            Everything Grainless does is built around one question:
          </p>
          <p className="mt-[2px] text-[1.5rem] italic text-white/85">
            “What would’ve helped me when I was struggling?”
          </p>
        </header>

        {/* Pills */}
        <div className="mt-[40px] space-y-[44px]">
          {/* Row 1 — left pill */}
          <div className="flex">
            <div className="w-[520px] rounded-[14px] bg-white/16 border border-white/14 px-[20px] py-[16px] backdrop-blur-[0.5px]">
              <h3 className="text-[14px] font-semibold text-center">Save your favorites</h3>
              <p className="mt-[6px] text-[12px] leading-snug text-center text-white/85">
                Bookmark meals and products, so you<br/>don’t forget what works for you.
              </p>
            </div>
          </div>

          {/* Row 2 — right pill */}
          <div className="flex">
            <div className="ml-auto w-[520px] rounded-[14px] bg-white/16 border border-white/14 px-[20px] py-[16px] backdrop-blur-[0.5px]">
              <h3 className="text-[14px] font-semibold text-center">Filter by goals</h3>
              <p className="mt-[6px] text-[12px] leading-snug text-center text-white/85">
                Gain weight? Eat Clean? Budget‑friendly?<br/>
                Tag‑based filtering gives you clarity fast.
              </p>
            </div>
          </div>

          {/* Row 3 — left pill */}
          <div className="flex">
            <div className="w-[520px] rounded-[14px] bg-white/16 border border-white/14 px-[20px] py-[16px] backdrop-blur-[0.5px]">
              <h3 className="text-[14px] font-semibold text-center">Dietary Flags Built‑In</h3>
              <p className="mt-[6px] text-[12px] leading-snug text-center text-white/85">
                Lactose‑free, nut‑free, soy‑free… no<br/>second guessing. It’s labeled right.
              </p>
            </div>
          </div>

          {/* Row 4 — right pill */}
          <div className="flex">
            <div className="ml-auto w-[520px] rounded-[14px] bg-white/16 border border-white/14 px-[20px] py-[16px] backdrop-blur-[0.5px]">
              <h3 className="text-[14px] font-semibold text-center">Constantly Evolving</h3>
              <p className="mt-[6px] text-[12px] leading-snug text-center text-white/85">
                New products, better meals, smarter<br/>filters — all added regularly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copy + tiny CTA */}
        <div className="mt-[56px] text-center">
          <p className="text-[13px] font-semibold">And the best part?</p>
          <p className="mt-[6px] text-[12px] text-white/85">
            <span className="font-semibold">Completely Free</span>, No pricing,<br/>
            <span className="italic">No strings attached.</span>
          </p>

          <button
            className="mt-[12px] inline-block rounded-[6px] px-[10px] py-[6px]
                       text-[11px] font-medium text-[#3D4F46] bg-white hover:bg-white/90 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>






    

      
   
      <Footer/>
      
    </main>
  )
}
