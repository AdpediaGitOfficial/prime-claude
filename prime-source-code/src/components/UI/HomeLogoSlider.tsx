"use client"
import React, { useEffect, useRef } from 'react'
import { MotionSpan, MotionH2, MotionP } from "@/components/MotionWrappers"
import Image from 'next/image'
import Link from 'next/link'
import LogoPrimeX from "../../../public/LOGO/final-out-02.webp"
import LogoSpa from "../../../public/LOGO/me-glow.jpg.jpeg"
import LogoStudy from "../../../public/LOGO/final-out-04.webp"
import LogoCafe from "../../../public/LOGO/final-out-05.png"
import LogoConference from "../../../public/LOGO/final-out-06.webp"
import LogoVendor from "../../../public/LOGO/final-out-07.webp"
import LogoPharmacy from "../../../public/LOGO/final-out-08.webp"
import LogoPool from "../../../public/LOGO/final-out-09.webp"
import LogoGym from "../../../public/LOGO/final-out-03.webp"

const HomeLogoSlider = () => {
  // Each logo links to its own brand's inner page.
  const logos = [
    { src: LogoPrimeX, href: '/prime-x-arena', label: 'Prime X Arena' },
    { src: LogoSpa, href: '/spa', label: 'Me Glow Wellness Lounge' },
    { src: LogoStudy, href: '/study-centre', label: 'Steel Tek Study Centre' },
    { src: LogoCafe, href: '/cafe', label: 'Café' },
    { src: LogoConference, href: '/conference', label: 'Regal Conference' },
    { src: LogoVendor, href: '/vendor', label: 'Forever 4 You' },
    { src: LogoPharmacy, href: '/pharmacy', label: 'Prime Pharma' },
    { src: LogoPool, href: '/pool-booking', label: 'Hideaway Swimsuites' },
    { src: LogoGym, href: '/gym', label: 'Oxy Gym' },
  ]

  // Two copies is all a seamless -50% loop needs; the previous four copies
  // rendered 36 images and made the marquee heavy/janky on mobile.
  const extendedLogos = [...logos, ...logos]

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full pt-12 overflow-hidden bg-white relative"
      style={{ contain: 'layout style', willChange: 'transform' }}
    >
      <div className="site-container">
        {/* Header */}
        <div className="flex flex-col items-center max-w-4xl mx-auto relative z-20">
          <MotionH2
            className="text-2xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2] text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
          >
            A World of Experiences<br />Under One Roof
          </MotionH2>
        </div>

        {/* Adjusted padding and min-height for larger logos */}
        <div className="relative w-full overflow-hidden flex py-2 bg-white min-h-[160px] md:min-h-[240px]"
          style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Increased gap from gap-x-5 to gap-x-6 (24px) for better spacing of large cards */}
          <div ref={trackRef} className="marquee-track flex w-max gap-x-6 will-change-transform">
            {extendedLogos.map((item, i) => {
              return (
                <div key={i} className="marquee-slot shrink-0 flex items-center justify-center">
                  <Link href={item.href} className="block w-full">
                    <div className="flex items-center justify-center p-4 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-[120px] md:h-[200px] lg:h-[220px] w-full">
                        <Image
                          src={item.src}
                          alt={item.label}
                          width={400}
                          height={300}
                          loading="lazy"
                          decoding="async"
                          className="object-contain h-full w-auto max-w-full"
                        />
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .marquee-track {
          /* Two copies now, so keep the same on-screen speed at ~half duration. */
          animation: marquee 13s linear infinite;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
        }
        @media (min-width: 1024px) {
          .marquee-track { animation-duration: 20s; }
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        /* 
         * Sizing logic: 
         * calc(Xvw - gap) ensures exactly that many items fit in the viewport.
         * Default to 2 columns, tablet to 3 columns, desktop (1024px+) to 4 columns strictly.
         */
        .marquee-slot { flex: 0 0 calc(50vw - 12px); }
        @media (min-width: 640px) { .marquee-slot { flex: 0 0 calc(33.333vw - 16px); } }
        @media (min-width: 1024px) { .marquee-slot { flex: 0 0 calc(25vw - 24px); } }

        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); } 
        }
      `}} />
    </section>
  )
}

export default HomeLogoSlider