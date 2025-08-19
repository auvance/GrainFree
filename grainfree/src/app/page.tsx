'use client'
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
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

    {/* Section 1  */}
    <section aria-labelledby="s1-title" className="bg-gradient-to-b from-[#67A871] to-[#517F58] text-white">
      
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

    </section>




    

      
   
      <Footer/>
      
    </main>
  )
}
