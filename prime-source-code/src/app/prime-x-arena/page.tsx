"use client";
import React from "react";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/MotionWrappers";
import Image from "next/image";

const PrimexArenaPage = () => {

  return (
    <>
      <div className=" bg-white text-black overflow-x-clip selection:bg-[#7C3AED] selection:text-white">
        {/* --- Hero Banner Section --- */}
        <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100svh] lg:min-h-[1060px]">
          <img
            src="/ASSETS/gaming-banner.webp"
            alt="Prime X Arena Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 48%,rgba(0,0,0,0.95) 100%)",
            }}
          ></div>

          <MotionDiv
            className="site-container relative h-full md:min-h-[100svh] lg:min-h-[1060px] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm md:text-base font-semibold text-[#D4FF00] tracking-wider uppercase mb-4 block">
              ENTERTAINMENT ZONE
            </span>

            <MotionH2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal leading-tight tracking-[-0.02em] text-white mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.7 }}
            >
              Prime X Arena
            </MotionH2>

            <MotionP
              className="text-base sm:text-lg md:text-xl leading-[1.4] text-white/90 max-w-[830px] px-2 sm:px-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              Experience the ultimate indoor entertainment destination designed for thrill, fun, and unforgettable moments. 
            </MotionP>
          </MotionDiv>
        </section>

        {/* --- Image Grid & About Section --- */}
        <section className="site-container bg-white relative pt-[60px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image Grid Layout (Sticky on Desktop) */}
            <div className="lg:sticky lg:top-32 w-full">
              <MotionDiv
                className="grid grid-cols-2 gap-4 md:gap-5 h-[340px] sm:h-[420px] lg:h-[520px] w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="flex flex-col gap-4 md:gap-5 h-full">
                  <div className="relative flex-1 rounded-[20px] md:rounded-[24px] overflow-hidden group">
                    <Image
                      src="/ASSETS/gaming-about-1.webp"
                      fill
                      alt="Flight Simulator"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative flex-1 rounded-[20px] md:rounded-[24px] overflow-hidden group">
                    <Image
                      src="/ASSETS/gaming-about-2.webp"
                      fill
                      alt="Bowling Alley"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="relative h-full rounded-[20px] md:rounded-[24px] overflow-hidden group">
                  <Image
                    src="/ASSETS/gaming-about-3.webp"
                    fill
                    alt="Gaming Arcade"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </MotionDiv>
            </div>

            {/* Right Column: About Content */}
            <div className="flex flex-col justify-center">
              <MotionH2
                className="text-3xl md:text-4xl lg:text-[40px] font-medium leading-[1.15] text-black mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                Entertainment Redefined
              </MotionH2>

              <MotionDiv
                className="flex flex-col gap-6"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <p className="text-gray-600 text-[16px] md:text-[17px] leading-relaxed max-w-xl">
                  Experience a vibrant gaming zone designed for fun, competition, and relaxation. Whether you&apos;re playing solo or with friends, enjoy a dynamic atmosphere built for all ages.
                </p>

                <ul className="mt-4 grid grid-cols-1 gap-4">
                  {[
                    "Modern Arcade Setup",
                    "Family-Friendly Environment",
                    "Multiplayer & Solo Games",
                    "High-Energy Atmosphere",
                  ].map((text, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 flex-shrink-0">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="#ef4444" />
                      </svg>
                      <span className="text-black text-base">{text}</span>
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            </div>
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
                className="text-3xl sm:text-5xl lg:text-[56px] font-normal text-white leading-[1.1] mb-6"
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

        {/* --- BOOKING & SELECTION SECTION --- */}
        {/* <section className="booking-section site-container pb-20 md:pb-[120px]">
          
          <div className="booking-container bg-[#F5F3FF] p-6 sm:p-10 md:p-[50px] lg:p-[60px] rounded-[30px] md:rounded-[40px] flex flex-col gap-10 md:gap-14 w-full mx-auto shadow-sm">
  
            <div className="booking-selection-firstrow">
              <h4 className="text-[22px] md:text-[26px] font-medium text-black mb-5 md:mb-6">Select Gaming Zone Preference</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    onClick={() => setSelectedZone(feature.id)}
                    className={`relative bg-white rounded-[16px] md:rounded-[20px] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full cursor-pointer transition-all duration-300 ${
                      selectedZone === feature.id
                        ? "ring-2 ring-[#7C3AED] shadow-md"
                        : "ring-1 ring-gray-100 hover:ring-[#7C3AED]/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="p-3 md:p-4 rounded-[12px] bg-[#7C3AED] text-white shrink-0">{feature.icon}</div>
                    <div className="pr-6 sm:pr-8 flex-1">
                      <h3 className="text-[18px] md:text-[20px] font-medium text-black mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-[14px] md:text-[15px] line-clamp-1">{feature.desc}</p>
                    </div>

                    <div
                      className={`absolute top-4 right-4 w-5 h-5 md:w-[22px] md:h-[22px] rounded-full flex items-center justify-center transition-colors border-2 ${
                        selectedZone === feature.id
                          ? "bg-[#7C3AED] border-[#7C3AED]"
                          : "border-[#D1C4E9] bg-transparent"
                      }`}
                    >
                      {selectedZone === feature.id && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-selection-secondrow w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 md:mb-6">
                <h4 className="text-[22px] md:text-[26px] font-medium text-black">Choose Your Time Slot</h4>
                <span className="text-[#7C3AED] font-medium bg-[#E9D5FF] px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap self-start sm:self-auto">1-Hour Sessions</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTime(slot)}
                    className={`relative bg-white rounded-[12px] md:rounded-[16px] p-3 md:p-4 flex items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                      selectedTime === slot
                        ? "ring-2 ring-[#7C3AED] shadow-md bg-[#F5F3FF]"
                        : "ring-1 ring-gray-200 hover:ring-[#7C3AED]/50 hover:shadow-sm"
                    }`}
                  >
                    <span className={`text-[14px] md:text-[16px] font-medium transition-colors ${
                      selectedTime === slot ? "text-[#7C3AED]" : "text-gray-700"
                    }`}>{slot}</span>
                    {selectedTime === slot && (
                      <div className="absolute -top-2 -right-2 bg-[#7C3AED] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

         
            <div className="booking-form-container bg-white p-6 sm:p-8 md:p-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[24px] md:rounded-[30px] w-full">
              
              <div className="booking-form-heading mb-6 md:mb-8">
                <h3 className="text-[22px] md:text-[28px] font-semibold text-black">Complete Your Booking</h3>
              </div>

              <form action="" className="flex flex-col gap-5 md:gap-6">
       
                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="fullName" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Full Name*</label>
                    <input type="text" id="fullName" placeholder="Enter full name" className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Phone Number*</label>
                    <input type="tel" id="phone" placeholder="Enter phone number" className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400" />
                  </div>
                </div>

          
                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="email" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Email Address*</label>
                    <input type="email" id="email" placeholder="Your@Email.Com" className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="guests" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Number Of Guest*</label>
                    <div className="relative">
                      <select id="guests" defaultValue="2" className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black appearance-none cursor-pointer">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                      <div className="absolute inset-y-0 right-5 md:right-6 flex items-center pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="date" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Date*</label>
                    <input type="date" id="date" className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-gray-500" />
                  </div>

                  <div className="w-full">
                    <label htmlFor="timeSlotForm" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Preferred Time*</label>
                    <div className="relative">
                      <select id="timeSlotForm" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black appearance-none cursor-pointer">
                        <option value="" disabled>--:--</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>{slot}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-5 md:right-6 flex items-center pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="specialRequest" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">Special Request</label>
                  <textarea name="specialRequest" id="specialRequest" rows={4} placeholder="Any special requirements..." className="w-full bg-[#F5F3FF] rounded-[20px] md:rounded-[24px] px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black resize-none"></textarea>
                </div>

               
                <div className="mt-2 md:mt-4 w-full">
                  <button type="button" className="bg-black text-white font-medium text-[15px] md:text-[16px] rounded-full py-4 md:py-[18px] hover:bg-gray-800 transition-colors w-full shadow-lg">Confirm Booking</button>
                </div>
                
              </form>
            </div>
            
          </div>
        </section> */}

      </div>
    </>
  );
};

export default PrimexArenaPage;
