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
        <div className=" | [@media(min-width:1400px)]:pt-70 | [@media(min-width:1500px)]:pt-125">
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
      
      <div className="mx-auto max-w-7xl px-10 py-30">

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
        <article className="mt-45 flex items-end gap-10 justify-center">
          <div>
            <div>
              <Image src="/image/rec1.png" width={500} height={500} alt="Picture of the author"/>
            </div>
          </div>

          <div className="w-150">
            <p className="text-[1.7rem] font-normal font-[AeonikArabic]">Choose your goals, allergies, food preferences, schedule & everything else that’s important.</p>
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


    <section className="bg-[#475845] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-16 pt-35 pb-40">

        {/* Title + subline */}
        <header className="text-center">
          <h2 className="font-[AeonikArabic] font-bold text-[3rem] leading-[1.15]">
            It’s not just a ‘Guide’
          </h2>
          <p className="font-[AeonikArabic] font-normal mt-[10px] font-light text-[1.5rem] leading-tight text-white/85">
            Everything Grainless does is built around one question:
          </p>
          <p className="font-[AeonikArabic] font-light mt-[2px] text-[1.5rem] italic text-white/85">
            “What would’ve helped me when I was struggling?”
          </p>
        </header>

        {/* Pills */}
        <div className="mt-[150px] space-y-[44px]">
          {/* Row 1 — left pill */}
          <div className="flex">
            <div className="w-[720px] rounded-tl-3xl bg-[#617862] border border-white/14 px-[20px] py-[86px] backdrop-blur-[0.5px] ">
              <h3 className="text-[1.5rem] font-bold font-[AeonikArabic] text-center">Save your favorites</h3>
              <p className="text-[1.2rem] font-normal font-[AeonikArabic] leading-snug text-center text-white/85">
                Bookmark meals and products, so you<br/>don’t forget what works for you.
              </p>
            </div>
          </div>

          {/* Row 2 — right pill */}
          <div className="flex">
            <div className="ml-auto w-[720px] rounded-tr-3xl bg-[#617862] border border-white/14 px-[20px] py-[86px] backdrop-blur-[0.5px]">
              <h3 className="text-[1.5rem] font-bold font-[AeonikArabic] text-center">Filter by goals</h3>
              <p className="text-[1.2rem] font-normal font-[AeonikArabic] leading-snug text-center text-white/85">
                Gain weight? Eat Clean? Budget‑friendly?<br/>
                Tag‑based filtering gives you clarity fast.
              </p>
            </div>
          </div>

          {/* Row 3 — left pill */}
          <div className="flex">
            <div className="w-[720px] rounded-tl-3xl bg-[#617862] border border-white/14 px-[20px] py-[86px] backdrop-blur-[0.5px]">
              <h3 className="text-[1.5rem] font-bold font-[AeonikArabic] text-center">Dietary Flags Built‑In</h3>
              <p className="text-[1.2rem] font-normal font-[AeonikArabic] leading-snug text-center text-white/85">
                Lactose‑free, nut‑free, soy‑free… no<br/>second guessing. It’s labeled right.
              </p>
            </div>
          </div>

          {/* Row 4 — right pill */}
          <div className="flex">
            <div className="ml-auto w-[720px] rounded-tr-3xl bg-[#617862] border border-white/14 px-[20px] py-[86px] backdrop-blur-[0.5px]">
              <h3 className="text-[1.5rem] font-bold font-[AeonikArabic] text-center">Constantly Evolving</h3>
              <p className="text-[1.2rem] font-normal font-[AeonikArabic] leading-snug text-center text-white/85">
                New products, better meals, smarter<br/>filters — all added regularly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copy + tiny CTA */}
        <div className="mt-[200px] text-center font-[AeonikArabic]">
          {/* Heading */}
          <p className="text-[2.5rem] font-semibold text-white">
            And the best part?
          </p>

          {/* Subtext */}
          <p className="text-[2rem] leading-snug text-[#9DE7C5] font-semibold italic text-[#9DE7C5]">
            Completely Free, No pricing,<br />
            No strings attached.
          </p>

          {/* Button */}
          <button
            className="mt-[20px] inline-block rounded-xl border border-white/40
                      px-[40px] py-[20px] text-[1rem] font-medium text-black 
                      bg-[#8EB397] hover:bg-white hover:text-[#3D4F46] 
                      transition-colors duration-300 shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </section>





    

      
   
      <Footer/>
      
    </main>
  )
}
