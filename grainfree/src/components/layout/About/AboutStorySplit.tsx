import Image from "next/image";
import React from "react";

type Props = {
  title?: string;
  paragraphs: React.ReactNode[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  bg?: string; // optional wrapper bg per section
  align?: "left" | "right";
};

export default function SplitSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  reverse,
  bg,
  align = "left",
}: Props) {
  const textAlign =
    align === "right" ? "text-right ml-auto" : "text-left";

  return (
    <section className={bg ?? ""}>
      <article
        className={[
          "mx-auto max-w-[1200px]",
          "px-6 sm:px-10",
          "py-16 sm:py-24",
          "flex flex-col lg:flex-row",
          "gap-10 lg:gap-16",
          "items-start lg:items-center",
          reverse ? "lg:flex-row-reverse" : "",
        ].join(" ")}
      >
        <div className="w-full lg:flex-1">
          {title ? (
            <h2
              className={[
                "text-[#4A4A4A] font-[AeonikArabic] font-bold",
                "text-[2.1rem] sm:text-[2.75rem] leading-[1.05]",
                textAlign,
                "max-w-[26ch]",
              ].join(" ")}
            >
              {title}
            </h2>
          ) : null}

          <div className={[title ? "mt-8" : "", "space-y-7"].join(" ")}>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={[
                  "text-[#4A4A4A] font-[AeonikArabic]",
                  "text-[1.15rem] sm:text-[1.35rem] leading-[1.15]",
                  textAlign,
                  "max-w-[60ch]",
                ].join(" ")}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[460px]">
          <div className="relative overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/5">
            <Image
              src={imageSrc}
              width={920}
              height={920}
              alt={imageAlt}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>
        </div>
      </article>
    </section>
  );
}
