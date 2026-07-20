"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
 {
    image: "/ASSETS/SM734003.jpg",
    title: "Oxy Gym",
    description: "World-class imported equipment & personal trainers",
    logo: "/LOGO/logo-main.svg",
  },
  {
    image: "/SWIMMING/swimming-service.png",
    title: "Hideaway Swimsuit",
    description: "Exclusive hourly bookings for ultimate privacy",
    logo: "/LOGO/final-out-02.webp",
  },
  {
    image: "/ASSETS/service_card_3.webp",
    title: "Wellness Cuisine",
    description: "Diet products & juice outlets from global brands",
    logo: "/LOGO/final-out-03.webp",
  },
  {
    image: "/ASSETS/service_card_4.webp",
    title: "Conference Hall",
    description: "Multimedia-ready corporate event spaces",
    logo: "/LOGO/final-out-04.webp",
  },
  {
    image: "/ASSETS/service_card_5.webp",
    title: "EV Charging",
    description: "Future-ready electric vehicle charging stations",
    logo: "/LOGO/final-out-05.webp",
  },
  {
    image: "/ASSETS/sub-menu-spa.webp",
    title: "Me Glow Wellness",
    description: "Premium spa and wellness treatments for total rejuvenation",
    logo: "/LOGO/final-out-06.webp",
  },
  {
    image: "/ASSETS/sub-menu-multi-brand.webp",
    title: "Multibrand Retail Store",
    description: "Curated retail offerings from premium lifestyle brands",
    logo: "/LOGO/final-out-07.webp",
  },
  {
    image: "/ASSETS/sub-menu-cafe.webp",
    title: "Cafe",
    description: "Casual dining and specialty beverages in a cozy setting",
    logo: "/LOGO/final-out-08.webp",
  },
  {
    image: "/ASSETS/sub-menu-gaming.webp",
    title: "Gaming Arcade",
    description: "Immersive arcade and console experiences for all ages",
    logo: "/LOGO/final-out-09.webp",
  },
  {
    image: "/ASSETS/service_card_3.webp",
    title: "Education",
    description: "Dedicated learning spaces and programs for children & adults",
    logo: "/LOGO/final-out-10.webp",
  },
  {
    image: "/ASSETS/service_card_4.webp",
    title: "Multipurpose Hall",
    description: "Versatile event spaces for conferences, exhibitions and more",
    logo: "/LOGO/logosvg.svg",
  },
];

const ServiceCarouselMobile = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="lg:hidden">
      <div className="relative">
        <div
          ref={containerRef}
          className="-mx-4 px-4 overflow-x-auto flex gap-4 snap-x snap-mandatory pb-4 no-scrollbar"
        >
          {services.map((service, i) => (
            <div
              key={i}
              className="snap-center flex-none w-[86%] sm:w-[72%] md:w-[48%] rounded-[18px] overflow-hidden group/card relative h-[320px] sm:h-[380px]"
            >
              {/* per-service logo moved into static text area (no overlay) */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />

              {/* Permanent Bottom Fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

              {/* Glassmorphic Hover Overlay (keeps parity with desktop) */}
              <div className="absolute inset-0 z-30 bg-white/5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 border border-white/10 rounded-[18px]">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: 0.04 }}
                  className="text-white/80 text-sm leading-relaxed transform translate-y-3 group-hover/card:translate-y-0 transition-transform duration-400"
                >
                  {service.description}
                </motion.p>
              </div>

              {/* Static Text Layer (logo above title) */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                {service.logo && (
                  <img src={service.logo} alt={`${service.title} logo`} className="w-[150px] h-auto mb-2 object-contain" />
                )}
                <p className="text-sm opacity-75 mt-1 line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating navigation centered vertically over cards */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="absolute top-1/2 -translate-y-1/2 left-4 w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 shadow-2xl z-50"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="absolute top-1/2 -translate-y-1/2 right-4 w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 shadow-2xl z-50"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default ServiceCarouselMobile;
