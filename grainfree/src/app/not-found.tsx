// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
    return (
      <main className="relative min-h-screen bg-[#8FA58F] text-white">
      {/* BIG 404 + caption in the top-right */}
      <div className="pointer-events-none select-none absolute right-8 top-8 text-right">
        <div className="leading-none font-extrabold tracking-tight text-white/95 text-[12rem]">
          404
        </div>
        <div className="-mt-2 text-[3rem] font-extrabold">Err-or??</div>
      </div>

      {/* Center content */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="px-6 text-center">
          <h1 className="font-[AeonikArabic] text-white/95 text-2xl sm:text-3xl leading-snug">
            how did we end up
            <br /> here? Try the homepage
          </h1>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl border border-white/35 bg-white/10 px-6 py-3
                       text-sm font-medium text-white hover:bg-white/20 focus:outline-none
                       focus:ring-2 focus:ring-white/40 transition"
          >
            Go Home
          </Link>

          <p className="mt-6 text-[12px] text-white/85 leading-relaxed">
            or contact us
            <br />
            <a
              href="mailto:aakifumar55@gmail.com"
              className="underline decoration-white/40 hover:decoration-white"
            >
              aakifumar55@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
    )
  }
  