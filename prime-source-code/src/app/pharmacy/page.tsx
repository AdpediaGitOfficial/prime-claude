import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import { MotionDiv, MotionP } from "@/components/MotionWrappers";

export const metadata = { title: "Pharmacy – Prime Promenade" };

export default function PharmacyPage() {
  return (
    <div className="bg-white text-black overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100vh] lg:min-h-[100vh]">
        <img
          src="/ASSETS/pharmacy-main-banner.webp"
          alt="Pharmacy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47.9%,rgba(0,0,0,0.9) 100%)",
          }}
        />
        
        <div className="site-container relative h-full md:min-h-[100vh] lg:min-h-[100vh] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full">
   
           <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mb-6"
          >
            <img src="/Service-logo/final-out-08.png" alt="Pharmacy" className="mx-auto w-[200px] md:w-[250px] object-contain" />
          </MotionDiv>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.3] max-w-2xl px-2 sm:px-0"
          >
            Your reliable partner in healthcare, providing essential medicines,
            wellness products, and professional pharmaceutical guidance to
            support your health journey.
          </MotionP>
        </div>
      </section>

      {/* ═══ YOUR HEALTH, OUR COMMITMENT (Standard Padding) ═══ */}
      <section className="site-container !py-[120px] ">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-[5%] items-start">
          {/* Left: Image mosaic */}
          <div className="w-full lg:w-[53%] flex-shrink-0">
            {/* Desktop mosaic */}
            <div className="img-mosaic hidden lg:block">
              <img
                src="/ASSETS/pharmacy-sub-3.webp"
                alt=""
                className="main-img"
              />
              <div className="top-right">
                <img
                  src="/ASSETS/pharmacy-sub-1.webp"
                  alt=""
                />
              </div>
              <div className="bottom-right">
                <img
                  src="/ASSETS/pharmacy-sub-2.webp"
                  alt=""
                />
              </div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-4">
              <img
                src="/ASSETS/pharmacy-sub-3-1.webp"
                alt="Pharmacy"
                className="w-full object-cover rounded-[16px] md:rounded-[20px]"
                style={{ aspectRatio: "585/539" }}
              />
              <div className="flex gap-4">
                <img
                  src="/ASSETS/pharmacy-sub-1.webp"
                  alt="Pharmacy"
                  className="w-1/2 object-cover rounded-[16px] md:rounded-[20px]"
                  style={{ aspectRatio: "283/270" }}
                />
                <img
                  src="/ASSETS/pharmacy-sub-2.webp"
                  alt="Pharmacy"
                  className="w-1/2 object-cover rounded-[16px] md:rounded-[20px]"
                  style={{ aspectRatio: "381/256" }}
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-4 md:gap-6 lg:pt-4">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">
              Your Health, Our Commitment
            </h2>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-black">
              Our pharmacy is dedicated to providing safe, reliable, and
              professional healthcare services. With licensed pharmacists and a
              comprehensive range of genuine medicines, we&apos;re here to
              support your wellness needs every day.
            </p>

            <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 mt-4">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <span className="star-icon text-xl md:text-[28px] mt-0.5 flex-shrink-0">
                  ✦
                </span>
                <div>
                  <p className="text-lg md:text-xl lg:text-[24px] font-medium leading-[1.35] mb-1">
                    Licensed Pharmacists
                  </p>
                  <p className="text-base md:text-lg lg:text-[20px] text-black/60 leading-[1.35]">
                    Expert guidance from qualified healthcare professionals
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <span className="star-icon text-xl md:text-[28px] mt-0.5 flex-shrink-0">
                  ✦
                </span>
                <div>
                  <p className="text-lg md:text-xl lg:text-[24px] font-medium leading-[1.35] mb-1">
                    Genuine Medicines
                  </p>
                  <p className="text-base md:text-lg lg:text-[20px] text-black/60 leading-[1.35]">
                    100% authentic products from authorised distributors
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <span className="star-icon text-xl md:text-[28px] mt-0.5 flex-shrink-0">
                  ✦
                </span>
                <div>
                  <p className="text-lg md:text-xl lg:text-[24px] font-medium leading-[1.35] mb-1">
                    Professional Support
                  </p>
                  <p className="text-base md:text-lg lg:text-[20px] text-black/60 leading-[1.35]">
                    Personalised care and consultation services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPLETE PHARMACY & WELLNESS SOLUTIONS (Alternating Section 1: 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div
          className="rounded-[24px] md:rounded-[30px] px-6 sm:px-10 lg:px-16 py-8 sm:py-10 lg:py-14"
          style={{ background: "rgba(96,75,158,0.15)" }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="flex flex-col gap-6 md:gap-8 lg:w-[40%] flex-shrink-0">
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">
                Complete Pharmacy &amp; Wellness Solutions
              </h2>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-black">
                We provide a comprehensive range of pharmacy and healthcare
                essentials to support your everyday well-being. From
                prescription and over-the-counter medicines to vitamins,
                supplements, first aid supplies, and personal care products, our
                pharmacy ensures trusted access to quality health solutions. We
                also offer reliable health monitoring devices and wellness
                products to help you manage and maintain a healthier lifestyle
                with confidence.
              </p>
            </div>
            <div className="w-full lg:flex-1 mt-4 lg:mt-0">
              <img
                src="/ASSETS/pharmacy-sub-4.webp"
                alt="Pharmacy products"
                className="w-full h-[250px] sm:h-auto object-cover rounded-[20px] md:rounded-[36px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE & SAFETY (Standard Padding) ═══ */}
      <section className="site-container">
        <div
          className="rounded-[24px] md:rounded-[30px] px-6 sm:px-8 lg:px-20 py-10 md:py-12 lg:py-16"
          style={{ background: "#e7e4f0" }}
        >
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-5">
              Compliance &amp; Safety
            </h2>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] max-w-lg mx-auto">
              Your safety is our priority. We adhere to the highest standards of
              pharmaceutical regulations
            </p>
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
            <div className="flex items-start gap-4 w-full">
              <span className="star-icon text-xl md:text-[22px] mt-0.5 flex-shrink-0">
                ✦
              </span>
              <div>
                <p className="text-lg md:text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Regulated Dispensing:
                </p>
                <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                  All medicines dispensed strictly as per healthcare regulations
                  and guidelines
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <span className="star-icon text-xl md:text-[22px] mt-0.5 flex-shrink-0">
                ✦
              </span>
              <div>
                <p className="text-lg md:text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Prescription Required:
                </p>
                <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                  Prescription medicines require valid doctor&apos;s
                  prescription
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <span className="star-icon text-xl md:text-[22px] mt-0.5 flex-shrink-0">
                ✦
              </span>
              <div>
                <p className="text-lg md:text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Authorised Sources:
                </p>
                <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                  All medicines sourced exclusively from authorised distributors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <span className="star-icon text-xl md:text-[22px] mt-0.5 flex-shrink-0">
                ✦
              </span>
              <div>
                <p className="text-lg md:text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Quality Assurance:
                </p>
                <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                  Rigorous quality checks and proper storage conditions
                  maintained
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice white card */}
          <div className="bg-white rounded-[24px] md:rounded-[33px] px-6 sm:px-8 lg:px-12 py-8 lg:py-10">
            <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-3 md:mb-5">
              Important Notice
            </p>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
              This pharmacy page is provided for informational purposes only.
              Online ordering or medicine delivery services are not available
              through this website. For purchasing medicines, consultations, or
              any healthcare needs, please visit our pharmacy directly.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ VISIT OUR PHARMACY (Alternating Section 2: 120px Padding) ═══ */}
     <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
            Visit Our Pharmacy
          </h2>
          <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
            Find us conveniently located within the building
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Location */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            {/* Changed justify-start to justify-center and removed pt- classes */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiMapPin className="text-[#604b9e] w-12 h-12 md:w-16 md:h-16 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Location
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                Ground Floor, West Wing Easily accessible from the main entrance
                for your convenience.
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            {/* Changed justify-start to justify-center and removed pt- classes */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiClock className="text-[#604b9e] w-12 h-12 md:w-16 md:h-16 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Opening Hours
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                Mon-Sat: 8:00 AM – 9:00 PM
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                Sun: 9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          {/* Contact */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            {/* Changed justify-start to justify-center and removed pt- classes */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiPhone className="text-[#604b9e] w-12 h-12 md:w-14 md:h-14 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Contact
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                +1 (555) 123-4567
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
