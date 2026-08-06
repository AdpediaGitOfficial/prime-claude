"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MotionH2 } from "@/components/MotionWrappers"

// Each card links to that brand's inner page. Images are existing repo
// photos for now; the 5 confirmed brand banners can be swapped in later.
const cards = [
  { img: "/SWIMMING/swimming_banner.webp",         brand: "Hideaway",      sub: "Swimsuites",             tagline: "Pool · Sauna · Jacuzzi",                 href: "/pool-booking" },
  { img: "/ASSETS/hall.webp",                       brand: "The Regal",     sub: "At the Promenade",       tagline: "Your perfect event begins here",         href: "/conference" },
  { img: "/ASSETS/gym.webp",                        brand: "Oxy Gym",       sub: "",                       tagline: "Your comeback starts here",              href: "/gym" },
  { img: "/SPA/meglow-banner.jpeg",                 brand: "Me Glow",       sub: "Wellness Lounge",        tagline: "Spa · Hair · Beauty · Skin",             href: "/spa" },
  { img: "/ASSETS/cafe-banner.webp",                brand: "The Venetian",  sub: "Bistro",                 tagline: "Per amore del cibo",                     href: "/cafe" },
  { img: "/ASSETS/prime-x-arena.jpg",               brand: "Prime X",       sub: "Arena",                  tagline: "",                                       href: "/prime-x-arena" },
  { img: "/ASSETS/study-center-main-banner.webp",   brand: "Steel Tek",     sub: "Study Centre",           tagline: "",                                       href: "/study-centre" },
  { img: "/ASSETS/vendor-main-banner.webp",         brand: "Forever 4 You", sub: "Fashion & Gifts",        tagline: "",                                       href: "/vendor" },
  { img: "/ASSETS/banner-pharma.jpg",               brand: "Prime Pharmas", sub: "Diet & Diabetic Centre", tagline: "Pharmacy · Opticals · Diabetes & Diet",  href: "/pharmacy" },
]

const EveryLevelSlider = () => {
  const extended = [...cards, ...cards]  // duplicate for a seamless -50% loop
  const trackRef = useRef<HTMLDivElement>(null)

  // Pause the animation while the section is off-screen (perf, matches logo strip).
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused' },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full pt-6 md:pt-10 pb-16 md:pb-24 overflow-hidden bg-white relative"
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

        <div ref={trackRef} className="exp-track flex w-max gap-5">
          {extended.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              aria-label={`${c.brand} ${c.sub}`.trim()}
              className="exp-card group shrink-0"
            >
              <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden border border-black/10 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={`${c.brand} ${c.sub}`.trim()}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
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
          animation: exp-scroll 55s linear infinite;
          padding: 8px 20px 16px;
          will-change: transform;
        }
        .exp-track:hover { animation-play-state: paused; }

        /* 3 cards per screen on desktop, 2 on tablet, ~1.3 on mobile */
        .exp-card { flex: 0 0 80vw; }
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
