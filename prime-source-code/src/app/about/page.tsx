"use client"
import { useState } from "react";
import { MotionDiv, MotionH2, MotionP } from "@/components/MotionWrappers";
import { AnimatePresence } from "framer-motion";

export default function AboutPage() {
  const [active, setActive] = useState<'mission' | 'vision'>('mission')

  return (
    <main className="bg-white text-black overflow-x-hidden">

      {/* Hero */}
      <section className="relative w-full h-[450px] md:h-screen md:min-h-[600px] ">
        <img src="/ASSETS/about_banner.webp" alt="Prime Promenade exterior" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47.9%,rgba(0,0,0,0.8) 100%)" }}></div>
        <MotionDiv
          className="relative h-full flex flex-col items-center justify-end px-5 pb-14 text-center sm:px-8 sm:pb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
       
          <MotionH2 className="text-white text-[30px] sm:text-5xl lg:text-[76px] font-normal leading-[1.15] sm:leading-[1.18] tracking-[-0.02em] mb-4 sm:mb-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: 0.7 }}>
            Prime destination.<br />Multiple experiences.
          </MotionH2>
          <MotionP className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.4] sm:leading-[1.3] max-w-xl" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18, duration: 0.6 }}>
            A landmark destination where architectural excellence meets intelligent design — crafted for the modern enterprise.
          </MotionP>
        </MotionDiv>
      </section>

      {/* Our Foundation */}
      <section className="section-y site-container">
        <MotionDiv className="flex flex-col items-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      
          <MotionH2 className="text-3xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2] text-center mb-5 sm:mb-8 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>Shaping the Future of Modern Commercial Living</MotionH2>
          <MotionP className="text-center text-base sm:text-lg lg:text-[20px] leading-[1.4] sm:leading-[1.3] text-black/80 max-w-3xl mx-auto mb-10 sm:mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}>
            Guided by a clear vision and a purpose-driven mission, we are creating a next-generation commercial destination where innovation, design, and community come together to redefine how businesses and people experience modern spaces.
          </MotionP>
        </MotionDiv>

        {/* Large image with Mission/Vision overlay */}
        <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden h-[570px] sm:h-[500px] lg:h-[830px]">
          <img src="/ASSETS/vision_mission.webp" alt="Foundation" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-black/80"></div>
            <MotionDiv className="absolute inset-0 flex flex-col items-center justify-end gap-5 sm:gap-6 px-5 sm:px-8 text-center pb-10 sm:pb-16 lg:pb-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="flex w-full flex-row gap-3 sm:gap-5 items-center justify-center">
                <button
                  onClick={() => setActive('mission')}
                  aria-pressed={active === 'mission'}
                  className={
                    (active === 'mission' ? 'glass-border ' : 'glass ') +
                    'w-1/2 sm:w-auto rounded-full px-4 sm:px-10 py-3 text-white text-base sm:text-lg lg:text-[22px] font-medium whitespace-nowrap text-center'
                  }
                >
                  Mission
                </button>
                <button
                  onClick={() => setActive('vision')}
                  aria-pressed={active === 'vision'}
                  className={
                    (active === 'vision' ? 'glass-border ' : 'glass ') +
                    'w-1/2 sm:w-auto rounded-full px-4 sm:px-10 py-3 text-white text-base sm:text-lg lg:text-[22px] whitespace-nowrap text-center'
                  }
                >
                  Vision
                </button>
              </div>

              <AnimatePresence mode="wait">
                {active === 'mission' ? (
                  <MotionDiv
                    key="mission"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="w-full"
                  >
                    <MotionP className="text-white text-lg sm:text-xl lg:text-[32px] font-medium leading-[1.3] max-w-2xl mx-auto" initial={false}>
                      Delivering world-class infrastructure with a human-centric approach.
                    </MotionP>
                    <MotionP className="text-white/90 text-sm sm:text-base lg:text-[20px] leading-[1.4] sm:leading-[1.3] max-w-2xl mx-auto mt-2" initial={false}>
                      Our mission is to create an environment that seamlessly integrates cutting-edge smart building technology with elegant design, providing tenants and visitors with an experience that is as functional as it is inspiring — bridging the gap between online and offline commerce.
                    </MotionP>
                  </MotionDiv>
                ) : (
                  <MotionDiv
                    key="vision"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="w-full"
                  >
                    <MotionP className="text-white text-lg sm:text-xl lg:text-[32px] font-medium leading-[1.3] max-w-2xl mx-auto" initial={false}>
                      A vibrant destination where community, commerce, and innovation converge.
                    </MotionP>
                    <MotionP className="text-white/90 text-sm sm:text-base lg:text-[20px] leading-[1.4] sm:leading-[1.3] max-w-2xl mx-auto mt-2" initial={false}>
                      Our vision is to create an enduring hub that fosters sustainable growth, inspires meaningful experiences, and connects people and businesses through elegant design, intelligent infrastructure, and exceptional service.
                    </MotionP>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
        </div>
      </section>

      {/* Architectural Concept */}
      <section className="pb-0">
        <div className="site-container mb-10 sm:mb-14 text-center">
          <MotionDiv className="flex flex-col items-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      
            <MotionH2 className="text-3xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2]" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>Where Form Meets Function</MotionH2>
          </MotionDiv>
        </div>

        {/* Building image */}
        <div className="relative mx-2 lg:mx-2.5 overflow-hidden" style={{ borderRadius: "24px 24px 0 0", height: "clamp(300px,50vw,922px)" }}>
          <img src="/ASSETS/architecture_concept.webp" alt="Prime Promenade Building" className="w-full h-full object-cover" />
        </div>

        {/* 3-column features dark */}
        <div className="bg-black mx-2 lg:mx-2.5 px-6 sm:px-10 lg:px-20 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-20">
            <MotionDiv className="flex flex-col gap-4 sm:gap-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }}>
              <MotionP className="text-white/50 text-lg sm:text-xl leading-[1.2]">01</MotionP>
              <MotionP className="text-white text-2xl sm:text-3xl lg:text-[35px] font-normal leading-[1.2]">Glass &amp; Steel Facade</MotionP>
              <MotionP className="text-white/70 text-base lg:text-lg leading-[1.4]">Floor-to-ceiling glazing maximizes natural light while creating a striking visual identity.</MotionP>
            </MotionDiv>
            <MotionDiv className="flex flex-col gap-4 sm:gap-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
              <MotionP className="text-white/50 text-lg sm:text-xl leading-[1.2]">02</MotionP>
              <MotionP className="text-white text-2xl sm:text-3xl lg:text-[35px] font-normal leading-[1.2]">Hybrid Retail Spaces</MotionP>
              <MotionP className="text-white/70 text-base lg:text-lg leading-[1.4]">Designed for seamless online-offline operations with integrated logistics support.</MotionP>
            </MotionDiv>
            <MotionDiv className="flex flex-col gap-4 sm:gap-5" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}>
              <MotionP className="text-white/50 text-lg sm:text-xl leading-[1.2]">03</MotionP>
              <MotionP className="text-white text-2xl sm:text-3xl lg:text-[35px] font-normal leading-[1.2]">Curated Interiors</MotionP>
              <MotionP className="text-white/70 text-base lg:text-lg leading-[1.4]">Italian marble, bespoke lighting, and designer furnishings.</MotionP>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Prime Promenade */}
      <section className="section-y site-container">

        <div className="grid lg:grid-cols-2 gap-5 sm:gap-10 items-start mb-10 sm:mb-14">
          <MotionH2 className="text-3xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2]">Prime Promenade</MotionH2>
          <MotionP className="text-base sm:text-lg lg:text-[20px] leading-[1.4] sm:leading-[1.3] text-black/80 lg:pt-4">
            With over two decades of excellence in real estate development, hospitality, and commercial ventures, Prime Promenade has established itself as a trusted name synonymous with quality, innovation, and unwavering commitment to its stakeholders.
          </MotionP>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Black stats card */}
          <div className="relative bg-black rounded-[20px] p-6 sm:p-10 h-[340px] sm:h-[380px] md:h-[522px] overflow-hidden">
            {/* top-left */}
            <div className="absolute top-6 left-6 flex flex-col items-start">
              <div className="flex items-start">
                <span className="text-white text-[52px] md:text-[64px] lg:text-[80px] font-normal leading-[1]">20</span>
                <span className="text-white text-xl md:text-[26px] lg:text-[30px] font-normal leading-none mt-1 sm:mt-2">+</span>
              </div>
              <p className="text-white text-base sm:text-lg lg:text-[22px] leading-[1.2] mt-2">Years</p>
            </div>

            {/* top-right */}
            <div className="absolute top-6 right-6 flex flex-col items-end">
              <div className="flex items-start">
                <span className="text-white text-[52px] md:text-[64px] lg:text-[80px] font-normal leading-[1]">50k</span>
                <span className="text-white text-xl md:text-[26px] lg:text-[30px] font-normal leading-none mt-1 sm:mt-2">+</span>
              </div>
              <p className="text-white text-base sm:text-lg lg:text-[22px] leading-[1.2] mt-2">Projects</p>
            </div>

            {/* center graphic */}
            <div className="absolute bottom-10 left-10 flex flex-col items-end pointer-events-none">
              <img src="/ICONS/about-arrow.svg" alt="arrow" className="w-20 h-20 sm:w-40 sm:h-40 md:w-56 md:h-56 object-contain opacity-95" />
            </div>

            {/* bottom-right */}
            <div className="absolute bottom-6 right-6 flex flex-col items-end">
              <div className="flex items-start">
                <span className="text-white text-[52px] md:text-[64px] lg:text-[80px] font-normal leading-[1]">100M</span>
                <span className="text-white text-xl md:text-[26px] lg:text-[30px] font-normal leading-none mt-1 sm:mt-2">+</span>
              </div>
              <p className="text-white text-base sm:text-lg lg:text-[22px] leading-[1.2] mt-2">Sq. Ft.</p>
            </div>
          </div>

          {/* Photo card */}
          <div className="rounded-[20px] overflow-hidden h-[clamp(240px,66.67vw,522px)]">
            <img src="/LOGO/prime.jpeg" alt="Prime Group" className="w-full h-full object-cover" />
          </div>

          {/* Lime card */}
          <div className="bg-[#e1ff83] rounded-[20px] p-6 sm:p-8 lg:p-10 h-[340px] sm:h-[380px] md:h-[522px] flex flex-col justify-center overflow-hidden">
            <p className="text-black/20 text-xl sm:text-2xl lg:text-[clamp(22px,2.4vw,45px)] font-medium leading-[1.3]">Built on Legacy</p>
            <p className="text-black text-[38px] sm:text-5xl lg:text-[clamp(42px,4.4vw,80px)] font-medium leading-[1.12] tracking-[-0.03em]">Driven by Excellence</p>
            <p className="text-black/20 text-xl sm:text-2xl lg:text-[clamp(22px,2.4vw,45px)] font-medium leading-[1.3] mt-2">Led by Passion</p>
          </div>
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="section-y site-container">
        <div className="grid lg:grid-cols-[465px_1fr] gap-10 sm:gap-16 lg:gap-24 items-start">
          {/* Left: photo floating above black rounded base */}
          <div className="relative flex-shrink-0 h-[460px] sm:h-[560px] lg:h-[641px]">
            <div className="absolute left-0 right-0 bottom-0 bg-black rounded-[20px] sm:rounded-[27px] h-[75%] lg:h-[498px]"></div>
            <div className="absolute inset-0 overflow-hidden rounded-[20px]">
              <img src="/ASSETS/doctor_about.webp" alt="Chairman" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Right: label + quote + description */}
          <MotionDiv className="flex flex-col gap-5 sm:gap-8 lg:pt-[133px]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
     
            <MotionP className="text-2xl sm:text-3xl lg:text-[50px] font-normal leading-[1.25] sm:leading-[1.2] text-black">
              &ldquo;We don&apos;t just build structures — we create ecosystems where ambition meets opportunity, where every detail speaks to an uncompromising standard of excellence.&rdquo;
            </MotionP>
            <MotionP className="text-base sm:text-lg lg:text-[20px] leading-[1.4] sm:leading-[1.3] text-black/80">
              Under the visionary leadership of our Chairman, Prime Group has consistently pushed the boundaries of what commercial spaces can achieve. This project represents the culmination of our expertise — a space that will set new benchmarks in luxury commercial development for generations to come.
            </MotionP>
          </MotionDiv>
        </div>
      </section>

      {/* Contact Section */}
    </main>
  );
}
