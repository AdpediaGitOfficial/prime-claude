import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import { MotionDiv, MotionP } from "@/components/MotionWrappers";

export const metadata = { title: "Prime Pharmas – Prime Promenade" };

const FEATURES = [
  "Licensed Pharmacists",
  "Optical Care",
  "Diabetes & Diet Centre",
  "Genuine Medicines",
  "Health Monitoring",
  "Expert Guidance",
];

const SERVICES = [
  "Prescription & Over-the-Counter Medicines",
  "Branded & Generic Medicines at Affordable Prices",
  "Vitamins & Nutritional Supplements",
  "Personal Care Products",
  "First Aid Essentials",
  "Health Monitoring Devices",
  "Optical Care & Vision Products",
  "Dedicated Food Products for Diet-Conscious Individuals",
  "Dedicated Food Products for People with Diabetes",
  "Diabetic-Friendly Juices, Soft Drinks & Ice Creams",
];

const COMPLIANCE = [
  {
    t: "Regulated Dispensing",
    s: "Prescription medicines are dispensed strictly according to healthcare regulations.",
  },
  {
    t: "Authorised Sources",
    s: "All medicines and healthcare products are sourced exclusively from authorised distributors.",
  },
  {
    t: "Prescription Required",
    s: "Prescription medicines are supplied only with a valid doctor's prescription.",
  },
  {
    t: "Quality Assurance",
    s: "Proper storage, regular quality checks and professional handling ensure product integrity.",
  },
];

export default function PharmacyPage() {
  return (
    <div className="bg-white text-black overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100vh] lg:min-h-[100vh]">
        <img
          src="/ASSETS/banner-pharma.jpg"
          alt="Prime Pharmas"
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
            className="mb-5"
          >
            <img src="/Service-logo/final-out-08.png" alt="Prime Pharmas" className="mx-auto w-[200px] md:w-[250px] object-contain" />
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-4"
          >
            <span className="inline-block bg-[#604b9e] text-white text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.06em] uppercase rounded-full px-4 py-1.5">
              Pharmacy • Opticals • Diabetes &amp; Diet Centre
            </span>
          </MotionDiv>

          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28, duration: 0.7 }}
            className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.3] max-w-2xl px-2 sm:px-0"
          >
            Your trusted healthcare destination for medicines, optical care,
            diabetes &amp; diet solutions, wellness products, and expert guidance —
            all under one roof.
          </MotionP>
        </div>
      </section>

      {/* ═══ YOUR HEALTH, OUR COMMITMENT ═══ */}
      <section className="site-container !py-[120px] ">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-[5%] items-start">
          {/* Left: Image mosaic */}
          <div className="w-full lg:w-[53%] flex-shrink-0">
            {/* Desktop mosaic */}
            <div className="img-mosaic hidden lg:block">
              <img
                src="/ASSETS/3.jpg"
                alt=""
                className="main-img"
              />
              <div className="top-right">
                <img
                  src="/ASSETS/1.jpg"
                  alt=""
                />
              </div>
              <div className="bottom-right">
                <img
                  src="/ASSETS/diet.png"
                  alt=""
                />
              </div>
            </div>
            {/* Mobile: stacked */}
            <div className="lg:hidden flex flex-col gap-4">
              <img
                src="/ASSETS/3.jpg"
                alt="Pharmacy"
                className="w-full object-cover rounded-[16px] md:rounded-[20px]"
                style={{ aspectRatio: "585/539" }}
              />
              <div className="flex gap-4">
                <img
                  src="/ASSETS/1.jpg"
                  alt="Opticals"
                  className="w-1/2 object-cover rounded-[16px] md:rounded-[20px]"
                  style={{ aspectRatio: "283/270" }}
                />
                <img
                  src="/ASSETS/diet.png"
                  alt="Diabetes & Diet"
                  className="w-1/2 object-cover rounded-[16px] md:rounded-[20px]"
                  style={{ aspectRatio: "381/256" }}
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-4 md:gap-6 lg:pt-4 flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">
              Your Health, Our Commitment
            </h2>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-black">
              Quality healthcare, trusted medicines, expert advice, and
              personalised support for every family.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 md:gap-y-6 mt-2 md:mt-4">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="star-icon text-lg md:text-2xl mt-0.5 flex-shrink-0">
                    ✦
                  </span>
                  <p className="text-lg lg:text-[21px] font-medium leading-[1.3]">
                    {f}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPLETE HEALTHCARE & WELLNESS SOLUTIONS ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div
          className="rounded-[24px] md:rounded-[30px] px-6 sm:px-10 lg:px-16 py-8 sm:py-10 lg:py-14"
          style={{ background: "rgba(96,75,158,0.15)" }}
        >
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">
              Complete Healthcare &amp; Wellness Solutions
            </h2>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-black max-w-3xl">
              Prime Pharmas offers a complete range of healthcare products and
              wellness solutions to support your everyday well-being.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mt-8 lg:mt-10">
            <div className="w-full lg:w-[55%] flex-shrink-0">
              <p className="text-lg md:text-xl font-medium mb-4 md:mb-6">
                Our services include:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {SERVICES.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="star-icon text-base md:text-lg mt-0.5 flex-shrink-0">
                      ✦
                    </span>
                    <span className="text-base lg:text-[17px] leading-[1.35]">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:flex-1 mt-2 lg:mt-0">
              <img
                src="/ASSETS/diet-2.jpg"
                alt="Healthcare and wellness consultation"
                className="w-full h-[250px] sm:h-[380px] lg:h-[440px] object-cover rounded-[20px] md:rounded-[36px]"
              />
            </div>
          </div>

          <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-black mt-8 lg:mt-10">
            Everything you need for better health, conveniently available in one
            place.
          </p>
        </div>
      </section>

      {/* ═══ COMPLIANCE & SAFETY ═══ */}
      <section className="site-container">
        <div
          className="rounded-[24px] md:rounded-[30px] px-6 sm:px-8 lg:px-20 py-10 md:py-12 lg:py-16"
          style={{ background: "#e7e4f0" }}
        >
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-5">
              Compliance &amp; Safety
            </h2>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] max-w-2xl mx-auto">
              Your health and safety remain our highest priority. Every product
              and service at Prime Pharmas follows stringent pharmaceutical and
              healthcare standards to ensure quality, authenticity, and customer
              confidence.
            </p>
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
            {COMPLIANCE.map((c) => (
              <div key={c.t} className="flex items-start gap-4 w-full">
                <span className="star-icon text-xl md:text-[22px] mt-0.5 flex-shrink-0">
                  ✦
                </span>
                <div>
                  <p className="text-lg md:text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                    {c.t}:
                  </p>
                  <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                    {c.s}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] text-center max-w-2xl mx-auto mb-10 md:mb-12">
            Our commitment is to deliver quality healthcare you can trust for
            every member of your family.
          </p>

          {/* Important Notice white card */}
          <div className="bg-white rounded-[24px] md:rounded-[33px] px-6 sm:px-8 lg:px-12 py-8 lg:py-10">
            <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-3 md:mb-5">
              Important Notice
            </p>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] mb-3 md:mb-4">
              Prescription medicines are dispensed only against a valid
              doctor&apos;s prescription and in accordance with healthcare
              regulations.
            </p>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] mb-3 md:mb-4">
              Online ordering and medicine delivery are not available through
              this website. For purchasing medicines, optical products, diabetes
              &amp; diet essentials, or any healthcare needs, please visit Prime
              Pharmas directly.
            </p>
            <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
              Our team is always available to assist you with pharmacy services,
              optical products, diabetes care, diet essentials, and wellness
              products.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ VISIT PRIME PHARMAS ═══ */}
     <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
            Visit Prime Pharmas
          </h2>
          <p className="text-base md:text-lg lg:text-[20px] leading-[1.35] max-w-3xl mx-auto">
            Visit Prime Pharmas at Prime Promenade for genuine medicines,
            optical care, diabetes &amp; diet solutions, and trusted healthcare
            services — all in one convenient location. Open every day, 9:00 AM –
            9:00 PM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {/* Location */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiMapPin className="text-[#604b9e] w-12 h-12 md:w-16 md:h-16 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Location
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                Ground Floor, West Wing — easily accessible from the main
                entrance.
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiClock className="text-[#604b9e] w-12 h-12 md:w-16 md:h-16 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Opening Hours
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                Open every day
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                9:00 AM – 9:00 PM
              </p>
            </div>
          </div>

          {/* Contact */}
          <div
            className="rounded-[24px] md:rounded-[30px] flex flex-col items-center text-center p-6 sm:p-8 md:p-10"
            style={{ background: "#e7e4f0", minHeight: "260px" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <FiPhone className="text-[#604b9e] w-12 h-12 md:w-14 md:h-14 mb-5 md:mb-8" strokeWidth={1.5} />
              <p className="text-xl lg:text-[26px] font-medium leading-[1.2] mb-3 md:mb-4">
                Contact
              </p>
              <p className="text-base md:text-lg lg:text-[20px] leading-[1.35]">
                +91 90707 99770
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
