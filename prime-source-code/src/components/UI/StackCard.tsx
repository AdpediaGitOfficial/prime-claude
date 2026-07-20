import { MotionH2 } from "@/components/MotionWrappers";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export default function StackCard() {
  return (
    <section className="pyt16 lg:pt-24 px-5 lg:px-8">
 
      <MotionH2
        className="text-3xl font-normal leading-[1.2] text-center mb-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ delay: 0.08, duration: 0.7, ease: "easeOut" }}
      >
        Every Level, a New<br />Experience
      </MotionH2>

      <div className="relative w-full">
        <div className="flex flex-col gap-8">
          {
            [
              {
                  img: "/ASSETS/pool-banner-1.jpeg",
                  logo: "/Service-logo/final-out-09.png",
                  title: "Pool   |   Sauna   |   Jacuzzi",
                  text: "Enjoy temperature control Ozone Activated Indoor Pool.",
                  gradient: "linear-gradient(211.6deg, rgba(0,0,0,0) 59.5%, rgba(0,0,0,0.8) 83.3%)",
                  logoWidth: 140,
                  imgPosition: "center center",
                  align: "left",
                },
                {
                  img: "/ASSETS/regal.jpeg",
                  logo: "/Service-logo/final-out-06.png",
                  // title: "Retail & Corporate",
                  text: "An event space ideal for corporate meetings, celebrations and gatherings.",
                  gradient: "linear-gradient(130.7deg, rgba(0,0,0,0) 50.5%, rgba(0,0,0,0.357) 60.5%, rgba(0,0,0,0.8) 93.1%)",
                  logoWidth: 220,
                  align: "right",
                },
                {
                  img: "/ASSETS/gym.webp",
                  logo: "/Service-logo/final-out-03.png",
                  // title: "Fitness & Sports",
                  text: "Your comeback starts here.",
                  gradient: "linear-gradient(43.5deg, rgba(0,0,0,0.8) 6.5%, rgba(0,0,0,0.49) 24.6%, rgba(0,0,0,0) 40.5%)",
                  logoWidth: 220,
                  align: "left",
                },
                {
                  img: "/ASSETS/megllow.jpeg",
                  logo: "/LOGO/final-out-10.webp",
                  // title: "Prime X Arena",
                  // text: "A multi-purpose arena for sports, events and entertainment.",
                  gradient: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 85%)",
                  logoWidth: 300,
                  align: "right",
                },
                {
                  img: "/ASSETS/coffee.jpeg",
                  logo: "/Service-logo/final-out-05.png",
                  // title: "Café & Dining",
                  // text: "Casual dining and artisanal coffee for every moment.",
                  gradient: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 90%)",
                  logoWidth: 250,
                  align: "left",
                },
                {
                  img: "/ASSETS/pharma.jpeg",
                  logo: "/Service-logo/final-out-08.png",
                  // title: "Prime Pharma",
                  // text: "On-site pharmacy and wellness support for residents and visitors.",
                  gradient: "linear-gradient(200deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 92%)",
                  logoWidth: 250,
                  align: "right",
                },
                {
                  img: "/ASSETS/edutech.jpeg",
                  logo: "/Service-logo/final-out-04.png",
                  // title: "Study Centre",
                  // text: "Professional training and educational programs for growth.",
                  gradient: "linear-gradient(140deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 88%)",
                  logoWidth: 250,
                  align: "left",
                },
            ].map((panel, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.06, duration: 0.6, ease: "easeOut" }}
                className="relative rounded-[20px] overflow-hidden h-[360px] lg:h-[720px]"
              >
                <img
                  src={panel.img}
                  alt={panel.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: panel.imgPosition ? panel.imgPosition : "center" }}
                />

                {/* common bottom overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[55%] lg:h-[48%] z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.92) 100%)",
                  }}
                />

                <div className="absolute inset-x-5 bottom-5 lg:inset-x-auto lg:bottom-14 lg:left-14 text-white lg:px-20 lg:py-8 z-20">
                  <img
                    src={panel.logo}
                    alt="Prime Promenade"
                    style={{
                      "--logo-width": panel.logoWidth
                        ? `${panel.logoWidth}px`
                        : "150px",
                    } as CSSProperties}
                    className="h-auto mb-1 object-contain w-[min(calc(var(--logo-width)*0.62),170px)] lg:w-[var(--logo-width)]"
                  />

                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="flex items-center gap-2 mb-1 text-lg opacity-90">
                    {/* title — allow wrapping on mobile (no truncation) */}
                    <span className="block max-w-full lg:max-w-md whitespace-normal break-words">{panel.title}</span>
                  </motion.div>

                  <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.12, duration: 0.6, ease: 'easeOut' }} className="text-lg lg:text-xl w-full leading-relaxed opacity-90 whitespace-normal">
                    {panel.text}
                  </motion.p>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>
    </section>
  );
}
