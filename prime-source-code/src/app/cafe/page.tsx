"use client";
import React from "react";
import {
  MotionDiv,
  MotionH2,
  MotionP,
  MotionSpan,
} from "@/components/MotionWrappers";
import Image from "next/image";

const page = () => {

  return (
    <>
      <div className="bg-white text-black overflow-x-hidden">
        {/* --- Hero Banner Section --- */}
        <section className="relative w-full overflow-hidden h-[450px] md:h-screen lg:min-h-[100vh] site-container">
          <img
            src="/ASSETS/cafe.jpg"
            alt="cafe"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0) 95%)",
            }}
          ></div>

          <MotionDiv
            className="relative h-full lg:min-h-[100vh] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.7 }}
              className="mb-6"
            >
              <img
                src="/Service-logo/final-out-05.png"
                alt="Cafe"
                className="mx-auto w-[160px] md:w-[220px] lg:w-[305px] object-contain"
              />
            </MotionDiv>

            <MotionP
              className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[830px] px-2 sm:px-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              Enjoy freshly brewed coffee, curated menus, and a relaxing
              ambience designed for comfort and connection.
            </MotionP>
          </MotionDiv>
        </section>
        

        {/* --- About Café Section (Screenshot Design) --- */}
        <section className="py-20 lg:py-28 site-container bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image Grid Layout */}
            <MotionDiv
              className="h-[340px] sm:h-[420px] lg:h-[520px] w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Single feature image (kept only the first image) */}
              <div className="relative rounded-[20px] md:rounded-[24px] overflow-hidden h-full w-full group">
                <Image
                  src="/ASSETS/about-image-1.jpeg"
                  fill
                  alt="Cafe Experience"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0"></div>
              </div>
            </MotionDiv>

            {/* Right Column: Text Content */}
            <div className="flex flex-col justify-center">
              <MotionH2
                className="text-[40px] md:text-[40px] lg:text-[40px] font-medium leading-[1.15] text-black mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                Complete Café & Dining Experience
              </MotionH2>

              <div className="flex flex-col gap-6">
                <MotionDiv
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                    Indulge in our wide selection of coffee varieties crafted by expert baristas, from classic espresso to specialty brews that awaken your senses.
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                    Complement your drink with our snacks & light meals, freshly prepared daily using premium ingredients for a delightful culinary experience.
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                   Relax in our comfortable seating areas, thoughtfully designed with modern aesthetics and cozy ambience to create the perfect atmosphere.
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                   Whether it's a business meeting, casual catch-up, or personal relaxation time, our café is perfect for any occasion.
                  </p>
                </MotionDiv>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full site-container pb-[0px] md:pb-[120px]">
          <div className="relative rounded-[30px] overflow-hidden h-[360px] md:h-[620px]">
            {/* Background Image */}
            <img
              src="/ASSETS/about-third-banner.webp"
              alt="Cafe"
              className="absolute inset-0 w-full h-full object-cover object-center md:object-bottom"
            />

            {/* Overlay for readability on small screens */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent pointer-events-none"></div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center md:justify-end px-4 md:px-12">
              <div className="text-white w-full md:w-[35%] px-4 md:px-0 text-left md:text-right md:mr-12">
                <h2 className="text-2xl md:text-[40px] font-medium mb-4 md:mb-10">
                  Our Café, Your Comfort
                </h2>

                <div className="flex flex-col gap-3 md:gap-4 items-start md:items-start">
                  {/* Item 1 */}
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 md:p-3 rounded-[20px]">
                      <img
                        src="/ICONS/coffee.png"
                        alt=""
                        className="w-8 md:w-[40px] h-8 md:h-[40px]"
                      />
                    </div>
                    <p className="text-sm md:text-base md:text-[24px]">
                      Premium Coffee & Beverages
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 md:p-3 rounded-[20px]">
                      <img
                        src="/ICONS/fresh-food.png"
                        alt=""
                        className="w-8 md:w-[40px] h-8 md:h-[40px]"
                      />
                    </div>
                    <p className="text-sm md:text-base md:text-[24px]">
                      Cold Beverages, Cakes & Ice cream
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 md:p-3 rounded-[20px]">
                      <img
                        src="/ICONS/sofa.png"
                        alt=""
                        className="w-8 md:w-[40px] h-8 md:h-[40px]"
                      />
                    </div>
                    <p className="text-sm md:text-base md:text-[24px]">
                      Cozy & Modern Ambience
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 md:p-3 rounded-[20px]">
                      <img
                        src="/ICONS/food-round.png"
                        alt=""
                        className="w-8 md:w-[40px] h-8 md:h-[40px]"
                      />
                    </div>
                    <p className="text-sm md:text-base md:text-[24px]">Friendly Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Moments / Gallery Section (added last) --- */}
       <section className="py-20 lg:py-28 site-container">
        <div className="bg-[#FEF6E8] rounded-[24px] p-6 md:p-10">
    

          {/* WRAPPING MOTION DIV */}
          <MotionDiv
            className="flex flex-col gap-4 md:gap-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
          >
            {/* === TOP ROW BLOCK === */}
            {/* On desktop, this row locks to 480px height, forcing all columns to perfectly flush. */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:h-[480px]">
              
              {/* Left: 2 Stacked Images */}
              {/* Uses its own grid to perfectly split the 480px height (minus the gap) in half */}
              <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-6 h-32 md:h-full">
                <div className="relative rounded-[16px] overflow-hidden w-full h-full">
                  <Image src="/ASSETS/cafe-about-sub-1.webp" fill alt="moment-1" className="object-cover" />
                </div>
                <div className="relative rounded-[16px] overflow-hidden w-full h-full">
                  <Image src="/ASSETS/gallery-image-1.jpeg" fill alt="moment-2" className="object-cover" />
                </div>
              </div>

              {/* Center: Large Feature Image */}
              {/* Automatically stretches to 480px height */}
              <div className="col-span-1 md:col-span-6 relative rounded-[20px] overflow-hidden h-[280px] md:h-full">
                <Image src="/ASSETS/about-image-2.jpeg" fill alt="feature-moment" className="object-cover" />
              </div>

              {/* Right: Portrait Image */}
              {/* Automatically stretches to 480px height, filling the empty space your previous code left */}
              <div className="hidden md:block col-span-3 relative rounded-[16px] overflow-hidden md:h-full">
                <Image src="/ASSETS/cafe-4.jpg" fill alt="moment-3" className="object-cover" />
              </div>
            </div>

            {/* === BOTTOM ROW BLOCK === */}
            {/* 3 equal images locked to a specific height for uniformity */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 h-28 md:h-[350px]">
              <div className="relative rounded-[12px] overflow-hidden w-full h-full">
                <Image src="/ASSETS/cafe-1.jpg" fill alt="gallery-1" className="object-cover" />
              </div>
              <div className="relative rounded-[12px] overflow-hidden w-full h-full">
                <Image src="/ASSETS/gallery-image-2.jpeg" fill alt="gallery-2" className="object-cover" />
              </div>
              <div className="relative rounded-[12px] overflow-hidden w-full h-full">
                <Image src="/ASSETS/cafe-3.jpg" fill alt="gallery-3" className="object-cover" />
              </div>
            </div>

          </MotionDiv>
        </div>
      </section>
      </div>
    </>
  );
};

export default page;
