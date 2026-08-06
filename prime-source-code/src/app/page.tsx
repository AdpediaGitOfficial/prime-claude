"use client";

import AnimatedText from "@/components/AnimatedText";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiCall, ENDPOINTS, assetUrl } from "@/utils/api";
import {
  MotionSpan,
  MotionH2,
  MotionP,
  MotionDiv,
} from "@/components/MotionWrappers";
import ServiceCarousel from "@/components/UI/ServiceCarousel";
import HomeLogoSlider from "@/components/UI/HomeLogoSlider";
import EveryLevelSlider from "@/components/UI/EveryLevelSlider";

const DEFAULT_HERO = "/ASSETS/banner-main.jpg";

export default function HomePage() {
  // Hero image from the "home-hero" banner (falls back to the default).
  const [heroImg, setHeroImg] = useState<string>(DEFAULT_HERO);
  useEffect(() => {
    let active = true;
    apiCall(`${ENDPOINTS.BANNERS}?location=home-hero`)
      .then((rows) => {
        if (!active || !Array.isArray(rows)) return;
        const withImage = rows.find((b) => b && b.imagePath);
        if (withImage) setHeroImg(assetUrl(withImage.imagePath));
      })
      .catch(() => {
        /* keep default hero */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="bg-white text-black">

      {/* Hero */}
      <section className="relative w-full h-[450px] md:h-screen md:min-h-[600px] overflow-hidden">
        <img
          src={heroImg}
          alt="Prime Promenade"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Changed gradient to bottom-to-top on mobile for better text readability when stacked, and left-to-right on larger screens */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-black/60 via-black/40 md:via-black/20 to-transparent md:to-transparent"></div>

        <div className="relative h-full flex flex-col justify-end pb-10 sm:pb-12 md:pb-20 site-container">
          {/* Added flex-col for mobile, lg:flex-row for desktop, and adjusted alignment */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-10">
            <div className="flex flex-col gap-2 md:gap-4">
              <AnimatedText
                as="h1"
                lines={["Prime Promenade"]}
                className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[72px] font-normal leading-[1.1] md:leading-[1.2] tracking-[-0.02em]"
                delay={0.15}
                stagger={0.06}
              />
              <AnimatedText
                as="p"
                lines={["A walk into a new lifestyle"]}
                className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal leading-snug"
                delay={0.35}
                stagger={0.04}
              />

              {/* Buttons moved below the main heading */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
                <Link href="/about" className="glass rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-white text-sm sm:text-base md:text-lg capitalize hover:bg-white/30 transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="glass rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-white text-sm sm:text-base md:text-lg capitalize hover:bg-white/30 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right-side content removed as requested */}
          </div>
        </div>
      </section>
      <HomeLogoSlider />
      <EveryLevelSlider />


      {/* Four Floors of Unmatched Excellence */}
      <section className="py-20 lg:py-28 site-container">
        {/* Image Grid: 3 columns (2:1:1) */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-5 items-start">
          {/* Col 1: Large tall image */}
          <MotionDiv
            className="relative rounded-[24px] overflow-hidden h-[480px] md:h-[600px] lg:h-[729px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.12, duration: 0.6 }}
          >
            <img
              src="/ASSETS/destination_1.jpg"
              alt="Prime Promenade Interior"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 rounded-[24px]"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-[25px] font-medium leading-tight mb-3">
                Elevating Lifestyle, <br></br>Under One Roof
              </p>
              {/* <p className="hidden lg:block text-base opacity-90 leading-relaxed tracking-tight w-[70%]">
                A thoughtfully planned four-floor destination where luxury
                architecture meets purposeful design—crafted to elevate fitness,
                wellness, business, and lifestyle experiences under one iconic
                roof.
              </p> */}
            </div>
          </MotionDiv>

          {/* Col 2: Top image + bottom lime card */}
          <div className="flex flex-col gap-5 h-[480px] md:h-[600px] lg:h-[729px]">
            <MotionDiv
              className="relative rounded-[24px] overflow-hidden flex-1 min-h-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              <img
                src="/ASSETS/destination_2.webp"
                alt="Designer Interiors"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[45%] to-black/70 rounded-[24px]"></div>
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[25px] font-medium leading-tight">
                  Curated Interiors
                </p>
                {/* <p className="text-sm mt-1 opacity-90">
                  Curated by award-winning architects
                </p> */}
              </div>
            </MotionDiv>
            <MotionDiv
              className="bg-[#e1ff83] rounded-[24px] flex-1 min-h-0 p-6 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: 0.22, duration: 0.6 }}
            >
              <div className="flex flex-col justify-end h-full items-start text-left">
                <img
                  src="/ICONS/Smart-Access.png"
                  alt=""
                  className="w-10 h-10 object-contain mb-3"
                />
                <div>
                  <p className="text-[25px] font-medium text-black leading-tight">
                    24 /7 surveillance & <br></br>24/7 power backup
                  </p>
                  {/* <p className="text-base text-black/80 leading-relaxed tracking-tight">
                    Biometric &amp; card-based secure entry systems
                  </p> */}
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Col 3: Tall image full height */}
          <MotionDiv
            className="relative rounded-[24px] overflow-hidden h-[480px] md:h-[600px] lg:h-[729px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.24, duration: 0.6 }}
          >
            <img
              src="/ASSETS/ev.jpg"
              alt="Premium Security"
              className="absolute inset-0 w-full h-full object-cover object-left"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[74%] to-black/20 rounded-[24px]"></div>

            <div className="absolute bottom-8 left-6 text-white">
              <p className="text-[25px] font-medium leading-tight mb-2">
                Wallet free charging station <br></br>for all EVs without any app
              </p>
              {/* <p className="text-base opacity-90 tracking-tight">
                24/7 surveillance & concierge services
              </p> */}
            </div>
          </MotionDiv>
        </div>
      </section>


      <section className="py-12 md:py-16 site-container">
        <div className="bg-[#111] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/5 relative">
          {/* Prime X logo in top-right */}
            <img
              src="/Service-logo/final-out-02.png"
              alt="Prime X"
              className="absolute right-4 bottom-4 md:top-4 md:bottom-auto md:right-[40px] h-auto object-contain z-20 w-[140px] md:w-[160px]"
              style={{ width: 140 }}
            />
          <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
            
            {/* Text Side */}
            <MotionDiv
              className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Added Eyebrow Tag for Premium Feel */}
              <MotionDiv 
                className="inline-block mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.05, duration: 0.5 }}
              >
                <span className="text-[#e1ff83] text-sm md:text-base font-medium tracking-widest uppercase">
                  Entertainment Zone
                </span>
              </MotionDiv>

              <MotionH2
                className="text-3xl font-normal text-white leading-[1.1] mb-5"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Prime X Arena
              </MotionH2>
              
              <MotionP
                className="text-base md:text-lg lg:text-[19px] text-white/70 leading-relaxed mb-10 max-w-xl"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                Experience the ultimate indoor entertainment destination designed for thrill, fun, and unforgettable moments. 
              </MotionP>

              {/* Upgraded List: From plain bullets to sleek mini-cards */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {[
                  "Bowling Alley",
                  "Cricket Pitch",
                  "Race Grid F1 Simulator",
                  "Flight Simulator",
                  "PS5 Lounge",
                  "Laser Tag"
                ].map((item, index) => (
                  <MotionDiv
                    key={index}
                    className="flex items-center gap-4 bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[16px] px-5 py-4 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#e1ff83] flex-shrink-0 shadow-[0_0_10px_rgba(225,255,131,0.6)]" />
                    <span className="text-white/90 text-base font-medium tracking-tight">
                      {item}
                    </span>
                  </MotionDiv>
                ))}
              </ul>
            </MotionDiv>

            {/* Image Side */}
            <MotionDiv
              className="relative h-[400px] md:h-[500px] lg:h-auto min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              <img
                src="/ASSETS/prime-x-arena.jpg"
                alt="Prime X Arena Indoor Entertainment"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Refined Overlays: Smoother blending into the dark card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/40 to-transparent hidden lg:block"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent block lg:hidden"></div>
            </MotionDiv>
            
          </div>
        </div>
      </section>


   
      <section className="py-20 lg:py-28 site-container">
        <MotionH2
          className="text-3xl font-normal leading-[1.2] text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
        >
          Built for Visionaries
        </MotionH2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* Corporate Offices */}
          <MotionDiv
            className="bg-black/10 rounded-[20px] p-6 h-[320px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.12, duration: 0.6 }}
          >
            <img
              src="/ICONS/Entrepreneurs.webp"
              alt=""
              className="w-12 h-12 object-contain"
            />
            <div>
              {/* <p className="text-xl font-medium text-black leading-tight mb-2">
                Entrepreneurs & Business Leaders
              </p> */}
              <p className="text-base text-black/70 leading-relaxed tracking-tight">
               Perfect for entrepreneurs and business leaders for networking and business meetings 
              </p>
            </div>
          </MotionDiv>

          {/* Wellness Brands */}
          <MotionDiv
            className="bg-[#e1ff83] rounded-[20px] p-6 h-[320px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.16, duration: 0.6 }}
          >
            <img
              src="/ICONS/Brand_Owners.webp"
              alt=""
              className="w-11 h-11 object-contain"
            />
            <div>
              {/* <p className="text-xl font-medium text-black leading-tight mb-2">
                Brand Owners & Retailers
              </p> */}
              <p className="text-base text-black/70 leading-relaxed tracking-tight pb-5">
               Excellent space for business to showcase their brand and retails

              </p>
            </div>
          </MotionDiv>

          {/* Event Organisers */}
          <MotionDiv
            className="bg-black rounded-[20px] p-6 h-[320px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src="/ICONS/Families.webp"
              alt=""
              className="w-12 h-12 object-contain"
              style={{ filter: "invert(1) brightness(2) contrast(1.1)" }}
            />
            <div>
              {/* <p className="text-xl font-medium text-white leading-tight mb-2">
                Families & Leisure Seekers
              </p> */}
              <p className="text-base text-white/70 leading-relaxed tracking-tight pb-5">
                Ideal for family space to enjoy pool , sauna and jacuzzi
              </p>
            </div>
          </MotionDiv>

          {/* Health-Conscious Individuals */}
          <MotionDiv
            className="bg-[#e1ff83] rounded-[20px] p-6 h-[320px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.24, duration: 0.6 }}
          >
            <img
              src="/ICONS/Fitness.webp"
              alt=""
              className="w-12 h-12 object-contain"
            />
            <div>
              {/* <p className="text-xl font-medium text-black leading-tight mb-2">
                Fitness & Wellness Enthusiasts
              </p> */}
              <p className="text-base text-black/70 leading-relaxed tracking-tight pb-5">
                Healthier lifestyle with access to fitness and wellness spaces

              </p>
            </div>
          </MotionDiv>

          {/* Lifestyle Seekers */}
          <MotionDiv
            className="bg-black/10 rounded-[20px] p-6 h-[320px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.28, duration: 0.6 }}
          >
            <img
              src="/ICONS/Lifestyle.webp"
              alt=""
              className="w-12 h-12 object-contain"
            />
            <div>
              {/* <p className="text-xl font-medium text-black leading-tight mb-2">
                Lifestyle & Wellness Seekers
              </p> */}
              <p className="text-base text-black/70 leading-relaxed tracking-tight">
               Experience the ultimate indoor entertainment destination for thrill fun and unforgettable moments
              </p>
            </div>
          </MotionDiv>
        </div>
      </section>

     
      
    </main>
  );
}
