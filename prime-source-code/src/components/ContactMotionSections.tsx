"use client";

import React from "react";
import Banner from "../public/images/contact-slider.jpg";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import {
  MotionSection,
  MotionDiv,
  MotionH2,
  MotionP,
  fadeUp,
} from "./MotionWrappers";

export default function ContactMotionSections() {
  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO (Section 1 - Odd) ═══ */}
      <MotionSection className="relative w-full overflow-hidden h-[450px] md:min-h-[100svh] lg:min-h-[730px]">
        <img src={Banner.src} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47%,rgba(0,0,0,0.9) 100%)",
          }}
        ></div>

        <div className="site-container relative h-full md:min-h-[100svh] lg:min-h-[730px] flex flex-col items-center justify-end !pb-16 md:!pb-20 !pt-32 md:!pt-40 text-center w-full">
          <div className="flex items-center gap-3 md:gap-5 text-white mb-6 md:mb-8">
            <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-white inline-block"></span>
            <span className="text-lg md:text-xl capitalize">Contact Us</span>
          </div>

          <MotionH2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal leading-tight tracking-[-0.02em] text-white mb-4 md:mb-6" variants={fadeUp}>
            Get in Touch
          </MotionH2>
          <MotionP className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[553px] px-2 sm:px-0" variants={fadeUp}>
            We&apos;re here to help. Reach out to us for any questions, support, or service enquiries.
          </MotionP>
        </div>
      </MotionSection>

      {/* ═══ INFO CARDS (Section 2 - Even - 120px Padding) ═══ */}
      <MotionSection className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Address */}
          <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px] transition-transform hover:-translate-y-1 duration-300">
            <FiMapPin className="w-10 h-10 md:w-[60px] md:h-[60px] text-[#604b9e] flex-shrink-0" strokeWidth={1.5} />
            <MotionP className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0" variants={fadeUp}>
              Address
            </MotionP>
            <a
              href="https://maps.google.com/?q=123+Business+Street,+Suite+100,+New+York,+NY+10001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-xl leading-[1.35] text-black hover:text-[#604b9e] hover:underline transition-colors"
            >
              123 Business Street, Suite 100,
              <br /> New York, NY 10001
            </a>
          </div>

          {/* Phone Number */}
          <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px] transition-transform hover:-translate-y-1 duration-300">
            <FiPhone className="w-10 h-10 md:w-[54px] md:h-[54px] text-[#604b9e] flex-shrink-0" strokeWidth={1.5} />
            <MotionP className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0" variants={fadeUp}>
              Phone Number
            </MotionP>
            <div className="text-base md:text-xl leading-[1.35] flex flex-col gap-1">
              <a href="tel:+15551234567" className="text-black hover:text-[#604b9e] hover:underline transition-colors">
                +1 (555) 123-4567
              </a>
              <a href="tel:+15551234567" className="text-black hover:text-[#604b9e] hover:underline transition-colors">
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* Email Address */}
          <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px] transition-transform hover:-translate-y-1 duration-300">
            <FiMail className="w-10 h-10 md:w-[56px] md:h-[56px] text-[#604b9e] flex-shrink-0" strokeWidth={1.5} />
            <MotionP className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0" variants={fadeUp}>
              Email Address
            </MotionP>
            <div className="text-base md:text-xl leading-[1.35] flex flex-col gap-1">
              <a href="mailto:contact@company.com" className="text-black hover:text-[#604b9e] hover:underline transition-colors">
                contact@company.com
              </a>
              <a href="mailto:contact@company01.com" className="text-black hover:text-[#604b9e] hover:underline transition-colors">
                contact@company01.com
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px] transition-transform hover:-translate-y-1 duration-300">
            <FiClock className="w-10 h-10 md:w-[54px] md:h-[54px] text-[#604b9e] flex-shrink-0" strokeWidth={1.5} />
            <MotionP className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0" variants={fadeUp}>
              Working Hours
            </MotionP>
            <p className="text-base md:text-xl leading-[1.35] text-black">Monday - Friday:<br className="md:hidden" /> 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </MotionSection>

      {/* ═══ SEND US A MESSAGE (Section 3 - Odd - Standard Padding) ═══ */}
      <MotionSection className="site-container py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-10">
          <MotionH2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4" variants={fadeUp}>
            Send us a Message
          </MotionH2>
          <MotionP className="text-base md:text-xl leading-[1.35] text-black/80 max-w-2xl mx-auto" variants={fadeUp}>
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </MotionP>
        </div>

        <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] p-6 sm:p-8 lg:p-12 xl:p-16">
          <form className="flex flex-col gap-6 md:gap-8">
            {/* form fields unchanged - keep native markup; inputs are not animated */}

            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">Full Name*</label>
                <div className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]" style={{ background: "#f0f0f0" }}>
                  <input type="text" placeholder="Enter full name" className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40" />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">Email Address*</label>
                <div className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]" style={{ background: "#f0f0f0" }}>
                  <input type="email" placeholder="your@email.com" className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40" />
                </div>
              </div>
            </div>

            {/* Row 2: Phone + Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">Phone Number*</label>
                <div className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]" style={{ background: "#f0f0f0" }}>
                  <input type="tel" placeholder="Enter full phone number" className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40" />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">Subject *</label>
                <div className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]" style={{ background: "#f0f0f0" }}>
                  <input type="text" placeholder="Enter subject" className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40" />
                </div>
              </div>
            </div>

            {/* Row 3: Message */}
            <div className="flex flex-col gap-2 md:gap-3">
              <label className="text-base md:text-xl capitalize leading-[1.35]">Message</label>
              <div className="rounded-[24px] md:rounded-[33px] flex items-start px-5 md:px-6 py-4 md:py-6 min-h-[120px] md:min-h-[159px]" style={{ background: "#f0f0f0" }}>
                <textarea rows={4} placeholder="Any special requirements and needs" className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none resize-none placeholder:not-italic placeholder:text-black/40"></textarea>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] transition-transform active:scale-95 h-14 md:h-[70px]">
              Send Message
            </button>
          </form>
        </div>
      </MotionSection>

      {/* ═══ OUR LOCATION (Section 4 - Even - 120px Padding) ═══ */}
      <MotionSection className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-10">
          <MotionH2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4" variants={fadeUp}>
            Our Location
          </MotionH2>
          <MotionP className="text-base md:text-xl leading-[1.35] text-black/80" variants={fadeUp}>
            Visit us at our office or find us on the map below.
          </MotionP>
        </div>

        <div className="relative rounded-[24px] md:rounded-[30px] overflow-hidden shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] min-h-[400px] md:min-h-[444px]">
          <div className="absolute inset-0 bg-[#e3e9e8] flex items-center justify-center text-black/40 text-lg md:text-xl">Map Placeholder</div>

          <div className="absolute left-4 right-4 bottom-4 md:bottom-auto md:left-auto md:right-6 md:top-6 bg-white rounded-[20px] md:rounded-[26px] px-5 py-4 md:px-6 md:py-5 flex flex-col gap-1 shadow-md w-auto md:min-w-[280px] md:max-w-[360px]">
            <div className="flex items-start justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <p className="text-lg md:text-xl font-semibold leading-[1.35] mb-1 text-black">Empire State Building</p>
                <p className="text-sm md:text-base leading-[1.35] text-black/80">20 W 34th St., New York, NY 10001</p>
                <p className="text-sm md:text-base text-black/60 mt-1 md:mt-2">4.7 rating (124,819)</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0 pt-1">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#e3e9e8] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#00372f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#e3e9e8] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#00372f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
