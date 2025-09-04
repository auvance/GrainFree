import Header from "../layout/Header"
import Footer from "../layout/Footer"
import Image from "next/image"
import SmoothScroll from "@/styles/SmoothScroll"

export default function PageAbout() {
    return (

        <main className="min-h-screen bg-[#BFDFC7] rounded-xl">
        <Header/>
    
        <section className="">
            <div className="relative inline-block flex">
                {/* Tag */}
                <div className="| [@media(min-width:1400px)]:pt-75 | [@media(min-width:1500px)]:pt-85">
                    {/* Heading */}
                    <h2 className="text-[#3D4F46] | [@media(min-width:1400px)]:text-[7rem] [@media(min-width:1500px)]:text-[11rem] | font-bold font-[AeonikArabic] leading-[0.85] tracking-tight pl-15">Why I built</h2>
                    <h1 className="text-[#3D4F46] | [@media(min-width:1400px)]:text-[12rem] [@media(min-width:1500px)]:text-[17rem] | font-bold font-[AeonikArabic] | leading-[0.85] tracking-tight | pl-15 pb-15">
                        Grain<span className="text-[#008509]">Free</span>
                    
                    </h1>
                </div>
            </div>
        </section>

        {/* Section 1 */}
        <section className="mt-[200px]">
            {/* Article - Surviving To Building */}
            <article className="flex flex-row gap-5 justify-center">
                <div className="w-220">
                    <h1 className="text-[#4A4A4A] font-[AeonikArabic] font-bold text-[3rem] w-100 leading-[1]">From Surviving to Building Again</h1>
                    <p className="mt-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] w-170">Before celiac, I was gaining muscle, eating well, finally feeling strong. But after one vacation, everything changed.</p>
                    <p className="mt-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] w-170">What started as food poisoning turned into fatigue, rapid weight loss, panic attacks, and months of confusion. No answers. Just frustration, anxiety, and feeling like I was slipping further away from who I was.</p>
                </div>
                <div>
                    <Image src="/image/Rec4.png" width={500} height={500} alt="Picture of the author"/>
                </div>
            </article>

            <article className="mt-[200px] flex flex-row-reverse gap-5 items-end justify-center mb-50">
                <div className="w-220">
                    <p className="mt-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] text-right w-190 ml-auto">
                        I tried to go back to my old routine, eating more, pushing through, but nothing 
                        worked. Every meal ended in fatigue, vomiting, anxiety, and eventually panic attacks. I was nearly diagnosed 
                        with PTSD.</p>
                    <p className="mt-10 mb-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] text-right w-190 ml-auto">
                        I saw doctors. Took pills. Still, nothing. Two years later, I was finally diagnosed with <span className="italic font-bold">celiac disease.</span>
                    </p>
                </div>
                <div>
                    <Image src="/image/Rec5.png" width={500} height={500} alt="Picture of the author"/>
                </div>
            </article>

        </section>

        {/* Section 2 */}
        <section className="bg-[#9ABF9E]">
            <article className="pt-[200px] flex flex-row-reverse gap-5 justify-center items-end mb-50">
                <div className="w-220">
                    <h1 className="text-[#4A4A4A] font-[AeonikArabic] font-bold text-[3rem] w-130 leading-[1] text-right ml-auto">Healing Took More Than a Diagnosis</h1>
                    <p className="mt-10 mb-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] text-right w-170 ml-auto">I was relieved, but also crushed. I couldn’t eat what I used to. I couldn’t trust labels. And figuring out what was safe felt like a full-time job.</p>
                    <p className="mt-10 mb-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] text-right w-170 ml-auto">With the help of my mom, we researched everything, snacks, ingredients, hidden gluten sources. It was long, exhausting, and overwhelming. But we made it work.</p>
                </div>
                <div>
                    <Image src="/image/Rec6.png" width={500} height={500} alt="Picture of the author"/>
                </div>
            </article>

            <article className="flex flex-row gap-5 justify-center items-end pb-50">
                <div className="w-220">
                    <p className="mt-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] w-170">I fasted for a month during Ramadan. I stayed strictly gluten-free. And I finally started gaining weight again.</p>
                    <p className="mt-10 text-[#4A4A4A] font-[AeonikArabic] text-[1.7rem] leading-[1] w-170">My energy came back. My mind was clear. <span>No fatigue. No panic.</span> Alhamdulillah.</p>
                </div>
                <div>
                    <Image src="/image/Rec6.png" width={500} height={500} alt="Picture of the author"/>
                </div>
            </article>
        </section>

        {/* Section 3 */}
        <section className="bg-[#739D78]">
            <div className="mx-auto w-full max-w-[1120px] px-[24px] py-[72px]">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="font-[AeonikArabic] font-bold text-[36px] leading-[1.15] text-white/95">
                        This is why I built
                    </h2>
                    <p className="mt-[6px] font-[AeonikArabic] font-bold text-[32px] leading-tight text-white/95">
                        Grain<span className="text-[#008509]">Free</span>
                    </p>

                    <p className="mt-[12px] text-[14px] leading-snug text-white/85">
                        This site wasn’t built by a company. It was
                        <br />built by someone who lived it.
                    </p>
                </div>

                {/* 3 squares */}
                <div className="mt-[36px] grid grid-cols-3 gap-[28px]">
                    {/* Replace each with <Image /> later */}
                    <Image src="/image/Rec8.png" width={400} height={400} alt="Picture of the author"/>
                    <Image src="/image/Rec8.png" width={400} height={400} alt="Picture of the author"/>
                    <Image src="/image/Rec8.png" width={400} height={400} alt="Picture of the author"/>
                </div>

                {/* Closing line */}
                <p className="mt-[20px] text-center text-[12px] leading-snug text-white/85 max-w-[520px] mx-auto">
                    Someone who struggled to figure it out, and
                    wants to make sure you don’t have to go
                    through that alone.
                </p>
            </div>

            <div>
                <article>
                    <div>
                        <h3>GrainFree is for:</h3>
                        <ul>
                            <li>✦ People trying to eat better without confusion</li>
                            <li>✦ Those struggling to gain weight on a gluten-free diet</li>
                            <li>✦ Anyone just trying to feel like themselves again</li>
                            <li>✦ and everyone in between</li>
                        </ul>
                    </div>
                    <div>
                        <Image src="/image/Rec9.png" width={400} height={400} alt="Picture of the author"/>
                    </div>
                    
                </article>
                <div>
                    <p>There’s no pricing, no spam, no BS. Just real food, smart tools, and a guide I wish I had when I needed it most.</p>
                </div>

                <button className="mt-[12px] inline-block rounded-[6px] px-[10px] py-[6px] text-[11px] font-medium text-[#3D4F46] bg-white hover:bg-white/90 transition">
                    Get Started
                </button>
            </div>
        </section>

    
        

        
      
        <Footer/>
    </main>
   
    )
  }
  