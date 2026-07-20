"use client";
import React, { useState } from "react";
import {
  MotionDiv,
  MotionH2,
  MotionP,
  MotionSpan,
} from "@/components/MotionWrappers";
import Image from "next/image";
import {
  FiMonitor,
  FiTarget,
  FiCrosshair,
  FiSun,
  FiSunset,
  FiMoon,
  FiActivity,
  FiLifeBuoy,
  FiAperture,
  FiShield,
} from "react-icons/fi";

const GamingPage = () => {
  // State for selections
  const [selectedZone, setSelectedZone] = useState<string>("flight");
  const [selectedTime, setSelectedTime] = useState<string>("morning");

  // Updated Features array with IDs and Icons for the selection grid
  const features = [
    {
      id: "flight",
      title: "Flight & F1 Dynamic Simulator",
      desc: "Experience the dream of driving in the circuits of your choice or competing with unknown riders. Take flight to your destination and have a happy landing—all without the fear of crashing!",
      icon: <FiCrosshair size={32} />,
    },
    {
      id: "bowling",
      title: "18-Meter 10 Pin Bowling Alley",
      desc: "First of its kind in Thrissur! An 18-meter long bowling alley with 4 dedicated lines, attached seating, and the option to enjoy the game with a mocktail of your choice.",
      icon: <FiLifeBuoy size={32} />,
    },
    {
      id: "shooting",
      title: "Shooting Range",
      desc: "Featuring auto-retrieval target shooting that gives you the perfect opportunity to trigger your hidden ambitions.",
      icon: <FiTarget size={32} />,
    },
    {
      id: "cricket",
      title: "Cricket Batting Pitch",
      desc: "Equipped with an automatic bowling machine. Pick and choose preset bowlers, speed, or spin. Enjoy it solo or as a team.",
      icon: <FiActivity size={32} />,
    },
    {
      id: "ps5",
      title: "PS5 Game Zone",
      desc: "A dedicated console gaming area designed keeping in mind the ultimate concept of 'Mingle and Play'.",
      icon: <FiMonitor size={32} />,
    },
    {
      id: "snooker",
      title: "Snooker & Shuffle Board",
      desc: "Spend your time testing your soft skills, accuracy, and strategic thinking with friends and family.",
      icon: <FiAperture size={32} />,
    },
    {
      id: "darts",
      title: "Darting Range",
      desc: "Test your skill with arrows—a childhood dream of every adult brought to life in our premium range.",
      icon: <FiTarget size={32} />,
    },
    {
      id: "kids",
      title: "Kids Safe Zone & Virtual Reality",
      desc: "A highly secure area for kids to spend their time happily with VR and games, while parents enjoy the gaming zone, gym, pool, spa, or jacuzzi with complete peace of mind.",
      icon: <FiShield size={32} />,
    },
  ];

  // 1-Hour Time Slots
  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
  ];

  return (
    <>
      <div className=" bg-white text-black overflow-x-hidden selection:bg-[#7C3AED] selection:text-white">
        {/* --- Hero Banner Section --- */}
        <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100vh] lg:min-h-[100vh]">
          <img
            src="/ASSETS/gaming-banner.webp"
            alt="Sports Gaming Arcade Banner"
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
            className="site-container relative h-full md:min-h-[100vh] lg:min-h-[1060px] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
   

            <MotionH2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal leading-tight tracking-[-0.02em] text-white mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.7 }}
            >
              Sports Gaming Arcade
            </MotionH2>

            <MotionP
              className="text-base sm:text-lg md:text-xl leading-[1.4] text-white/90 max-w-[830px] px-2 sm:px-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              A dream come true for most of us. Step into the ultimate arena of
              thrills with dynamic simulators, professional bowling alleys, and
              dedicated zones for all ages.
            </MotionP>
          </MotionDiv>
        </section>

        {/* --- Image Grid & About Section --- */}
        <section className="site-container bg-white relative py-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image Grid Layout (Sticky on Desktop) */}
            <div className="lg:sticky lg:top-32 w-full">
              <MotionDiv
                className="grid grid-cols-2 gap-4 md:gap-5 h-[400px] sm:h-[500px] lg:h-[700px] w-full"
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
                className="text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.15] text-black mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                Welcome to the Ultimate <br className="hidden lg:block" />{" "}
                Entertainment Hub
              </MotionH2>

              <MotionDiv
                className="flex flex-col gap-6"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                  Our Sports Gaming Arcade is meticulously designed to bring
                  your virtual dreams to life. Whether you are an adrenaline
                  junkie looking to conquer F1 circuits, a sports enthusiast
                  aiming for the perfect strike in our 18-meter bowling alley,
                  or a parent seeking a safe, immersive environment for your
                  children, we have something extraordinary for everyone.
                </p>
                <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                  Beyond the tracks and lanes, our dedicated PS5 Game Zone and
                  Virtual Reality arenas offer next-level interactive
                  entertainment. Test your precision at our automated shooting
                  and darting ranges, challenge friends to a strategic game of
                  snooker, or perfect your swing at our high-tech cricket
                  batting pitch equipped with automated bowling machines.
                </p>
                <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed">
                  We believe entertainment is best enjoyed together. Crafted
                  with the concept of "Mingle and Play," our space features
                  comfortable seating and a vibrant atmosphere where you can sip
                  on your favorite mocktail between games.
                </p>
                <p className="text-gray-600 text-[17px] md:text-lg leading-relaxed font-medium text-black">
                  Step into a world of cutting-edge technology, vibrant energy,
                  and unforgettable memories. Unleash your competitive spirit
                  and enjoy a gaming experience like never before.
                </p>
              </MotionDiv>
            </div>
          </div>
        </section>

        <section className="w-full site-container pb-[80px] md:pb-[120px]">
      <div className="relative rounded-[30px] overflow-hidden h-[450px] md:h-[620px]">
        {/* Background Image */}
        <img
          src="/ASSETS/gamming-banner-third.webp"
          alt="Sports Gaming Arcade"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Gradient Overlay for Text Readability (Fades to dark on the right side) */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 md:from-transparent via-black/50 md:via-black/40 to-black/90"></div>

        {/* Content */}
        <div className="relative h-full flex items-end md:items-center justify-center md:justify-end px-6 md:px-16 pb-10 md:pb-0">
          <div className="text-white w-full md:w-[45%] lg:w-[40%] flex flex-col">
            <h2 className="text-3xl md:text-[40px] font-medium mb-6 md:mb-10 leading-tight">
              Unleash Your Gaming Potential
            </h2>

            <div className="flex flex-col gap-5 md:gap-6">
              {/* Item 1 */}
              <div className="flex items-center gap-4">
                <div className="bg-[#7C3AED] p-3 md:p-4 rounded-[16px] md:rounded-[20px] shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <FiMonitor className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-lg md:text-[22px] font-medium tracking-wide">
                  Next-Gen Consoles & VR
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-4">
                <div className="bg-[#7C3AED] p-3 md:p-4 rounded-[16px] md:rounded-[20px] shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <FiCrosshair className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-lg md:text-[22px] font-medium tracking-wide">
                  Dynamic Simulators
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-4">
                <div className="bg-[#7C3AED] p-3 md:p-4 rounded-[16px] md:rounded-[20px] shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <FiTarget className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-lg md:text-[22px] font-medium tracking-wide">
                  Sports & Arcade Zones
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-4">
                <div className="bg-[#7C3AED] p-3 md:p-4 rounded-[16px] md:rounded-[20px] shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <FiShield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-lg md:text-[22px] font-medium tracking-wide">
                  Kids Safe Environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

        {/* --- BOOKING & SELECTION SECTION --- */}
        <section className="booking-section site-container pb-20 md:pb-[120px]">
          {/* Main Booking Container matching the requested div formation */}
          <div className="booking-container bg-[#F5F3FF] p-6 sm:p-10 md:p-[50px] lg:p-[60px] rounded-[30px] md:rounded-[40px] flex flex-col gap-10 md:gap-14 w-full mx-auto shadow-sm">
            
            {/* 1. Select Gaming Zone */}
            <div className="booking-selection-firstrow">
              <h4 className="text-[22px] md:text-[26px] font-medium text-black mb-5 md:mb-6">
                Select Gaming Zone Preference
              </h4>
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
                    <div className="p-3 md:p-4 rounded-[12px] bg-[#7C3AED] text-white shrink-0">
                      {feature.icon}
                    </div>
                    <div className="pr-6 sm:pr-8 flex-1">
                      <h3 className="text-[18px] md:text-[20px] font-medium text-black mb-1">
                        {feature.title}
                      </h3>
                      {/* Subtitle truncated to match the compact card style */}
                      <p className="text-gray-500 text-[14px] md:text-[15px] line-clamp-1">
                        {feature.desc.split('.')[0]}
                      </p>
                    </div>

                    {/* Circular Radio Button matching the design */}
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

            {/* 2. Choose Your Time Slot */}
            <div className="booking-selection-secondrow w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 md:mb-6">
                <h4 className="text-[22px] md:text-[26px] font-medium text-black">
                  Choose Your Time Slot
                </h4>
                <span className="text-[#7C3AED] font-medium bg-[#E9D5FF] px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap self-start sm:self-auto">
                  1-Hour Sessions
                </span>
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
                    <span 
                      className={`text-[14px] md:text-[16px] font-medium transition-colors ${
                        selectedTime === slot ? "text-[#7C3AED]" : "text-gray-700"
                      }`}
                    >
                      {slot}
                    </span>
                    
                    {/* Small Check Icon for selected state */}
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

            {/* 3. Complete Your Booking Form */}
            <div className="booking-form-container bg-white p-6 sm:p-8 md:p-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[24px] md:rounded-[30px] w-full">
              
              <div className="booking-form-heading mb-6 md:mb-8">
                <h3 className="text-[22px] md:text-[28px] font-semibold text-black">
                  Complete Your Booking
                </h3>
              </div>

              <form action="" className="flex flex-col gap-5 md:gap-6">
                
                {/* Row 1: Name & Phone */}
                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="fullName" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Enter full name"
                      className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Guests */}
                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="email" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Your@Email.Com"
                      className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black placeholder-gray-400"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="guests" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Number Of Guest*
                    </label>
                    <div className="relative">
                      <select
                        id="guests"
                        defaultValue="2"
                        className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black appearance-none cursor-pointer"
                      >
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

                {/* Row 3: Date & Preferred Time */}
                <div className="form-row flex flex-col md:flex-row items-center gap-5 md:gap-6">
                  <div className="w-full">
                    <label htmlFor="date" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Date*
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-gray-500"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="timeSlotForm" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                      Preferred Time*
                    </label>
                    <div className="relative">
                      <select
                        id="timeSlotForm"
                        value={selectedTime} // Syncs with the grid selection above
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-[#F5F3FF] rounded-full px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black appearance-none cursor-pointer"
                      >
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

                {/* Textarea: Special Request */}
                <div className="w-full">
                  <label htmlFor="specialRequest" className="text-[14px] md:text-[15px] font-medium text-gray-700 block mb-2">
                    Special Request
                  </label>
                  <textarea
                    name="specialRequest"
                    id="specialRequest"
                    rows={4}
                    placeholder="Any special requirements..."
                    className="w-full bg-[#F5F3FF] rounded-[20px] md:rounded-[24px] px-5 py-3.5 md:px-6 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black resize-none"
                  ></textarea>
                </div>

                {/* Full Width Black Submit Button */}
                <div className="mt-2 md:mt-4 w-full">
                  <button
                    type="button"
                    className="bg-black text-white font-medium text-[15px] md:text-[16px] rounded-full py-4 md:py-[18px] hover:bg-gray-800 transition-colors w-full shadow-lg"
                  >
                    Confirm Booking
                  </button>
                </div>
                
              </form>
            </div>
            
          </div>
        </section>

      </div>
    </>
  );
};

export default GamingPage;
