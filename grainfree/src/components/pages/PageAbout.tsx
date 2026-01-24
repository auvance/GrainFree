import Header from "../layout/Header/Header";
import Footer from "../layout/Footer";

import AboutHero from "@/components/layout/About/AboutHero";
import SplitSection from "@/components/layout/About/AboutStorySplit";

export default function PageAbout() {
  return (
    <main className="min-h-screen bg-[#BFDFC7] rounded-xl">
      <Header />

      <AboutHero />

      {/* Section 1 */}
      <SplitSection
        title="From Surviving to Building Again"
        imageSrc="/image/Rec4.png"
        imageAlt="From surviving to building again"
        paragraphs={[
          "Before celiac, I was gaining muscle, eating well, finally feeling strong. But after one vacation, everything changed.",
          "What started as food poisoning turned into fatigue, rapid weight loss, panic attacks, and months of confusion. No answers. Just frustration, anxiety, and feeling like I was slipping further away from who I was.",
        ]}
      />

      <SplitSection
        reverse
        align="right"
        imageSrc="/image/Rec5.png"
        imageAlt="Diagnosis journey"
        paragraphs={[
          <>
            I tried to go back to my old routine, eating more, pushing through, but nothing
            worked. Every meal ended in fatigue, vomiting, anxiety, and eventually panic attacks.
            I was nearly diagnosed with PTSD.
          </>,
          <>
            I saw doctors. Took pills. Still, nothing. Two years later, I was finally diagnosed
            with <span className="italic font-bold"> celiac disease.</span>
          </>,
        ]}
      />

      {/* Section 2 */}
      <SplitSection
        bg="bg-[#9ABF9E]"
        reverse
        align="right"
        title="Healing Took More Than a Diagnosis"
        imageSrc="/image/Rec6.png"
        imageAlt="Healing"
        paragraphs={[
          "I was relieved, but also crushed. I couldn’t eat what I used to. I couldn’t trust labels. And figuring out what was safe felt like a full-time job.",
          "With the help of my mom, we researched everything — snacks, ingredients, hidden gluten sources. It was long, exhausting, and overwhelming. But we made it work.",
        ]}
      />

      <SplitSection
        bg="bg-[#9ABF9E]"
        imageSrc="/image/Rec6.png"
        imageAlt="Recovery"
        paragraphs={[
          "I fasted for a month during Ramadan. I stayed strictly gluten-free. And I finally started gaining weight again.",
          <>
            My energy came back. My mind was clear. <span className="font-semibold">No fatigue. No panic.</span>{" "}
            Alhamdulillah.
          </>,
        ]}
      />

      {/* Section 3 (keep for now; we can componentize next) */}
      <section className="bg-[#739D78]">
        <div className="mx-auto w-full py-[160px] sm:py-[220px] px-6 sm:px-10">
          <div className="text-center">
            <h2 className="font-[AeonikArabic] font-bold text-[clamp(2.5rem,5vw,5rem)] leading-[1] text-[#4A4A4A]">
              Purpose of Grain<span className="text-[#008509]">Free</span>
            </h2>

            <p className="mt-6 font-[AeonikArabic] font-semibold text-[#4A4A4A] text-[clamp(1.2rem,2.4vw,2rem)] leading-[1.15]">
              This site wasn’t built by a company. It was
              <br className="hidden sm:block" />
              built by someone who lived it.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
