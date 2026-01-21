// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#8FA58F] text-white overflow-hidden">
      {/* MOBILE / TABLET LAYOUT (centered poster) */}
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center lg:hidden">
        <div className="w-full max-w-sm">
          <div className="leading-none font-extrabold tracking-tight text-white/95 text-[clamp(4.5rem,22vw,6.5rem)]">
            404
          </div>

          <div className="-mt-2 font-extrabold text-white/95 text-[clamp(2.2rem,10vw,3.25rem)]">
            Err-or??
          </div>

          <h1 className="mt-4 font-[AeonikArabic] text-white/85 text-[clamp(1.05rem,4.6vw,1.4rem)] leading-snug">
            how did we end up
            <br /> here? Try the homepage
          </h1>

          <Link
            href="/"
            className="
              mt-6 inline-flex w-full items-center justify-center
              rounded-2xl border border-black/25
              bg-black/10 px-7 py-4
              text-sm font-medium text-white/90
              shadow-[0_10px_25px_rgba(0,0,0,0.12)]
              transition
              hover:bg-black/15
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
          >
            Go Home
          </Link>
        </div>

        {/* Bottom contact (anchored) */}
        <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
          <p className="text-[12px] text-white/65 leading-relaxed">
            or contact us
            <br />
            <a
              href="mailto:aakifumar55@gmail.com"
              className="text-white/75 underline decoration-white/30 hover:decoration-white/60 break-all"
            >
              aakifumar55@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* DESKTOP LAYOUT (your original top-right 404 + center content) */}
      <div className="hidden lg:block">
        {/* BIG 404 + caption in the top-right */}
        <div className="pointer-events-none select-none absolute right-10 top-10 text-right">
          <div className="leading-none font-extrabold tracking-tight text-white/95 text-[12rem]">
            404
          </div>
          <div className="-mt-3 text-[3rem] font-extrabold">Err-or??</div>
        </div>

        {/* Center content */}
        <div className="flex min-h-screen items-center justify-center px-10">
          <div className="max-w-md text-center">
            <h1 className="font-[AeonikArabic] text-white/90 text-2xl leading-snug">
              how did we end up
              <br /> here? Try the homepage
            </h1>

            <Link
              href="/"
              className="
                mt-6 inline-flex items-center justify-center
                rounded-xl border border-white/35 bg-white/10
                px-7 py-4 text-sm font-medium text-white
                hover:bg-white/20
                focus:outline-none focus:ring-2 focus:ring-white/40
                transition
              "
            >
              Go Home
            </Link>

            <p className="mt-6 text-xs text-white/70 leading-relaxed">
              or contact us
              <br />
              <a
                href="mailto:aakifumar55@gmail.com"
                className="underline decoration-white/35 hover:decoration-white"
              >
                aakifumar55@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
