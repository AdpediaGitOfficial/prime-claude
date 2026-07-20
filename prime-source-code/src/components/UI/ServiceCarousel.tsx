"use client";

import React from "react";
import { MotionH2, MotionP } from "@/components/MotionWrappers";
import { motion } from "framer-motion";

const services = [
  {
    image: "/ASSETS/SM734003.jpg",
    title: "Oxy Gym",
    description: "A unique cardio zone surrounded by refreshing greenery",
    logo: "/Service-logo/final-out-03.png",
  },
  {
    image: "/ASSETS/sub-menu-spa.webp",
    title: "Me Glow Wellness",
    description: "Premium spa and wellness treatments for total rejuvenation",
    logo: "/Service-logo/final-out-10.png",
  },
  {
    image: "/SWIMMING/swimming-service.png",
    title: "Hideaway Swimsuit",
    description: "All-day swimwear and training facilities",
    logo: "/Service-logo/final-out-09.png",
  },
  {
    image: "/ASSETS/sub-menu-multi-brand.webp",
    title: "Multi-brand Retail Store",
    description: "Curated retail offerings from premium lifestyle brands",
    logo: "/Service-logo/final-out-07.png",
  },
  {
    image: "/ASSETS/sub-menu-cafe.webp",
    title: "Cafe",
    description: "Casual dining and specialty beverages in a cozy setting",
    logo: "/Service-logo/final-out-05.png",
  },
  {
    image: "/ASSETS/gaming-about-2.webp",
    title: "Gaming Arcade",
    description: "Immersive arcade and console experiences for all ages",
    logo: "/Service-logo/final-out-02.png",
  },
  {
    image: "/ASSETS/service_card_5.webp",
    title: "Pharmacy",
    description: "State-of-the-art arena for sports and esports events",
    logo: "/Service-logo/final-out-08.png",
  },
  {
    image: "/ASSETS/study-center-main-banner.webp",
    title: "Education",
    description: "Dedicated learning spaces and programs for children & adults",
    logo: "/Service-logo/final-out-04.png",
  },
  {
    image: "/ASSETS/hall-about.webp",
    title: "Multipurpose Hall",
    description: "Versatile event spaces for conferences, exhibitions and more",
    logo: "/Service-logo/final-out-06.png",
  },
];

const ServiceCarousel = () => {

  return (
    <section className="py-16 lg:py-24 overflow-hidden bg-white select-none">
      <div className="relative site-container">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-14">
          <div className="flex-1">
   
            <MotionH2 className="w-[100%] lg:w-[60%] text-4xl lg:text-[56px] font-medium leading-[1.1] tracking-tight text-black">
              Amenities Crafted for an Elevated Lifestyle
            </MotionH2>
          </div>
          <MotionP className="text-lg text-black/60 max-w-md lg:pt-4">
            An expertly curated collection of fitness, wellness, corporate, and lifestyle amenities—designed to inspire performance, relaxation, and meaningful experiences in one seamless destination.
          </MotionP>
        </div>

      {/* Grid layout of service cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="relative w-full h-[520px] rounded-[24px] overflow-hidden group/card">
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 z-20 bg-white/5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 border border-white/10 rounded-[24px]" />
              <div className="absolute bottom-6 left-6 right-6 text-white transition-opacity duration-200 z-10">
                {service.logo && (
                  <img
                    src={service.logo}
                    alt={`${service.title} logo`}
                    className={
                      service.title === "Hideaway Swimsuit"
                        ? "w-[100px] h-auto object-contain"
                        : "w-[150px] h-auto object-contain"
                    }
                  />
                )}
                <p className="text-sm opacity-70 mt-1 line-clamp-1">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ServiceCarousel;