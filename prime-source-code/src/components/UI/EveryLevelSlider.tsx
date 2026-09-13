"use client"
import React from 'react'
import Link from 'next/link'
import { MotionH2 } from "@/components/MotionWrappers"

// Each card links to that brand's inner page. Images are existing repo
// photos for now; the 5 confirmed brand banners can be swapped in later.
// Lightweight mobile-sized images (≤600px) keep the marquee smooth — big
// source photos made the compositor re-rasterize heavily on mobile.
const cards = [
  { img: "/ASSETS/hide-mob.jpg",     brand: "Hideaway",      sub: "Swimsuites",             tagline: "Pool · Sauna · Jacuzzi",                 href: "/pool-booking" },
  { img: "/ASSETS/regal-mob.jpg",    brand: "The Regal",     sub: "At the Promenade",       tagline: "Your perfect event begins here",         href: "/conference" },
  { img: "/ASSETS/oxy-mob.jpg",      brand: "Oxy Gym",       sub: "",                       tagline: "Your comeback starts here",              href: "/gym" },
  { img: "/ASSETS/meglow-mob.jpg",   brand: "Me Glow",       sub: "Wellness Lounge",        tagline: "Spa · Hair · Beauty · Skin",             href: "/spa" },
  { img: "/ASSETS/exp/cafe.webp",    brand: "The Venetian",  sub: "Bistro",                 tagline: "Per amore del cibo",                     href: "/cafe" },
  { img: "/ASSETS/primex-mob.jpg",   brand: "Prime X",       sub: "Arena",                  tagline: "",                                       href: "/prime-x-arena" },
  { img: "/ASSETS/steeltek-mob.jpg", brand: "Steel Tek",     sub: "Study Centre",           tagline: "",                                       href: "/study-centre" },
  { img: "/ASSETS/forever-mob.jpg",  brand: "Forever 4 You", sub: "Fashion & Gifts",        tagline: "",                                       href: "/vendor" },
  { img: "/ASSETS/pharma-mob.jpg",   brand: "Prime Pharmas", sub: "Diet & Diabetic Centre", tagline: "Pharmacy · Opticals · Diabetes & Diet",  href: "/pharmacy" },
]

const EveryLevelSlider = () => {
  const extended = [...cards, ...cards]  // duplicate for a seamless -50% loop

  // No IntersectionObserver play-state toggling: pausing/resuming a CSS
  // animation hitches on iOS Safari (worse for a `reverse` loop), and an
  // off-screen compositor transform is essentially free, so we let it run.

  return (
    <section className="w-full pt-6 md:pt-10 overflow-hidden bg-white relative"
      style={{ contain: 'layout style' }}
    >
      <div className="site-container">
        <div className="flex flex-col items-center max-w-4xl mx-auto relative z-20">
          <MotionH2
            className="text-2xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2] text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
          >
            Every Level, a New Experience.
          </MotionH2>
        </div>
      </div>

      <div className="relative w-full overflow-hidden flex" style={{ isolation: 'isolate' }}>
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 md:w-28 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 md:w-28 bg-gradient-to-l from-white to-transparent z-10"></div>

        <div className="exp-track flex w-max gap-5">
          {extended.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              aria-label={`${c.brand} ${c.sub}`.trim()}
              className="exp-card group shrink-0"
            >
              <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden border border-black/10 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* eager: marquee images sit off-screen and move in via
                    transform, so lazy-loading leaves them blank on mobile */}
                <img
                  src={c.img}
                  alt={`${c.brand} ${c.sub}`.trim()}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.10) 0%,rgba(0,0,0,0) 32%,rgba(0,0,0,0.72) 100%)" }}
                />

                {/* Visit chip on hover */}
                <span className="absolute top-3 right-3 bg-[#e1ff83] text-black text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Visit →
                </span>

                <div className="absolute left-0 right-0 bottom-0 p-5 md:p-6 text-white">
                  <p className="font-bold leading-[1.05] text-xl md:text-2xl [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
                    {c.brand}
                    {c.sub && (
                      <span className="block font-medium text-[0.5em] tracking-[0.22em] uppercase opacity-90 mt-1">
                        {c.sub}
                      </span>
                    )}
                  </p>
                  {c.tagline && (
                    <p className="mt-2 text-sm md:text-[15px] font-medium opacity-95 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                      {c.tagline}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .exp-track {
          /* Faster on phones (iOS read as sluggish); calmer on large screens.
             Constant (linear) speed = smoothest flow. */
          animation: exp-scroll 20s linear infinite reverse;
          padding: 8px 20px 16px;
          /* Force a dedicated GPU layer so scrolling stays on the compositor
             (off the main thread) — this is what keeps it smooth on mobile. */
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        @media (min-width: 1024px) {
          .exp-track { animation-duration: 48s; }
        }
        .exp-track:hover { animation-play-state: paused; }

        /* Phones: ~2 cards/screen so the full track stays under iOS Safari's
           compositor layer-size budget (a wider track janks/evicts on iOS). */
        .exp-card { flex: 0 0 52vw; }
        @media (min-width: 640px)  { .exp-card { flex: 0 0 46vw; } }
        @media (min-width: 1024px) { .exp-card { flex: 0 0 calc(33.333vw - 27px); } }

        @keyframes exp-scroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .exp-track { animation: none; }
        }
      ` }} />
    </section>
  )
}

export default EveryLevelSlider
