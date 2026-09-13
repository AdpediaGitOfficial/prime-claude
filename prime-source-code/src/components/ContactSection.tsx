"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
import { apiCall, ENDPOINTS } from "@/utils/api";

const DEFAULT_CONTACT = {
  generalEnquiry: "+91- 90707 99 700",
  primePharma: "+91- 90707 99 770",
  arenaBooking: "+91- 90707 99 079",
  oxygymBooking: "+91- 90707 99 709",
  email: "info@primepromenade.com",
};

const PHONES: { key: keyof typeof DEFAULT_CONTACT; label: string }[] = [
  { key: "generalEnquiry", label: "General Enquiry" },
  { key: "primePharma", label: "Prime Pharma" },
  { key: "arenaBooking", label: "Primex Arena Booking" },
  { key: "oxygymBooking", label: "OXYGYM Booking" },
];

const telHref = (v: string) => `tel:${v.replace(/[^\d+]/g, "")}`;

export default function ContactSection() {
  // Contact details from site settings (fallback to defaults if unreachable).
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  useEffect(() => {
    let active = true;
    apiCall(ENDPOINTS.SITE_SETTINGS)
      .then((data) => {
        if (!active || !data || typeof data !== "object") return;
        const c = (data as { contact?: Partial<typeof DEFAULT_CONTACT> }).contact;
        if (c) setContact({ ...DEFAULT_CONTACT, ...c });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      active = false;
    };
  }, []);

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
                {PHONES.map((p) => (
                  <a key={p.key} href={telHref(contact[p.key])} aria-label={`Call ${p.label}`} className="block text-base text-white hover:text-white/90">
                    {contact[p.key]} <span className="text-white/60">: {p.label}</span>
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/60 mb-1">Email:</p>
                <a href={`mailto:${contact.email}`} className="text-base text-white/80 hover:text-white">{contact.email}</a>
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
