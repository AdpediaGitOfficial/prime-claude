"use client"

import React from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";

export default function ContactSection() {
  

  return (
    <section className="bg-[black] pt-20 lg:pt-28 pb-0">
      <div className="px-8 lg:px-16 xl:px-32">
    
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-[60px] font-normal leading-[1.2] text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ delay: 0.06, duration: 0.7, ease: "easeOut" }}
        >
          Begin Your Journey
        </motion.h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visit Us */}
          <motion.div
            className="bg-[#181818] rounded-[20px] p-8 lg:p-10 flex flex-col gap-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ delay: 0.08, duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <p className="text-3xl font-semibold text-white mb-4">Visit Us</p>
              <p className="text-base text-white/80 leading-relaxed">
                Prime Promenade<br />
                Near Reliance Petrol Station,<br />
                Puzhakkal, Thrissur, Kerala 680553
              </p>
            </div>

            <div className="flex flex-col gap-3 text-white">
              <div className="space-y-2">
                <a href="tel:+919070799700" aria-label="Call General Enquiry" className="block text-base text-white hover:text-white/90">+91- 90707 99 700 <span className="text-white/60">: General Enquiry</span></a>
                <a href="tel:+919070799770" aria-label="Call Prime Pharma" className="block text-base text-white hover:text-white/90">+91- 90707 99 770 <span className="text-white/60">: Prime Pharma</span></a>
                <a href="tel:+919070799079" aria-label="Call Primex Arena Booking" className="block text-base text-white hover:text-white/90">+91- 90707 99 079 <span className="text-white/60">: Primex Arena Booking</span></a>
                <a href="tel:+919070799709" aria-label="Call OXYGYM Booking" className="block text-base text-white hover:text-white/90">+91- 90707 99 709 <span className="text-white/60">: OXYGYM Booking</span></a>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 mb-1">Email:</p>
                <a href="mailto:info@primepromenade.com" className="text-base text-white/80 hover:text-white">info@primepromenade.com</a>
              </div>
            </div>
          </motion.div>
          {/* Google Map embed */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-[#181818] rounded-[20px] overflow-hidden w-full aspect-video">
              <iframe
                title="Prime Promenade Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.3911958529775!2d76.17401719999997!3d10.548529400000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ed0039d0c85f%3A0xf63c3514e25bb704!2sPrime%20Promenade!5e0!3m2!1sen!2sin!4v1779002985053!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <div className="h-8"></div>
    </section>
  );
}
