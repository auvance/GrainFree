"use client";

import Image from "next/image";

export default function CeliacPhases() {
  return (
    <section
      aria-labelledby="s1-title"
      className="bg-gradient-to-b from-[#67A871] to-[#517F58] text-white rounded-xl pb-70"
    >
      <div className="mx-auto max-w-7xl px-10 py-30">
        <div className="flex items-center justify-between">
          <h2 id="s1-title" className="text-[34px] leading-tight font-[AeonikArabic]">
            <span className="font-semibold">
              Struggling with <i className="not-italic italic">Celiac Disease</i>?
            </span>
            <br />
            <span className="font-semibold italic text-[#153C28]">
              Not Anymore.
            </span>
          </h2>

          <p className="text-[1.1rem] text-right leading-snug text-white font-[AeonikArabic]">
            Tell us about your diet, and
            <br /> we&apos;ll build your starting plan
          </p>
        </div>

        <article className="mt-45 flex items-end gap-10 justify-center">
          <div>
            <Image
              src="/image/rec1.png"
              width={500}
              height={500}
              alt="Diet setup"
            />
          </div>

          <div className="w-150">
            <p className="text-[1.7rem] font-normal font-[AeonikArabic]">
              Choose your goals, allergies, food preferences, schedule & everything
              else that&apos;s important.
            </p>
            <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">
              Tell us about your diet.
            </p>
            <span>
              <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">1</h2>
            </span>
          </div>
        </article>
      </div>

      {/* Section 2 */}
      <section className="mx-auto w-200 mt-55">
        <div>
          <article className="flex flex-col gap-2">
            <div>
              <Image
                src="/image/rec2.png"
                width={800}
                height={500}
                alt="System build"
              />
            </div>

            <div className="flex flex-row-reverse justify-end items-center gap-7">
              <div className="w-150">
                <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">
                  Let our system build for you.
                </p>
                <p className="text-[1.5rem] font-normal font-[AeonikArabic]">
                  Our AI-enhanced guide maps out your starter plan; products,
                  meals, and routines built around you.
                </p>
              </div>
              <div>
                <span>
                  <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">
                    2
                  </h2>
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mx-auto w-250 mt-75">
        <div>
          <article className="flex flex-col gap-10 items-end">
            <div className="flex flex-row items-end gap-5">
              <div>
                <Image
                  src="/image/Rec3.png"
                  width={1200}
                  height={500}
                  alt="Discovery"
                />
              </div>
              <div>
                <span>
                  <h2 className="text-[7rem] font-extrabold font-[AeonikArabic]">
                    3
                  </h2>
                </span>
              </div>
            </div>

            <div>
              <div className="text-right w-150">
                <p className="italic text-[1.5rem] font-bold font-[AeonikArabic]">
                  Let our system build for you.
                </p>
                <p className="text-[1.5rem] font-normal font-[AeonikArabic]">
                  Our AI-enhanced guide maps out your starter plan; products,
                  meals, and routines built around you.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
