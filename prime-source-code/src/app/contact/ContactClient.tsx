"use client";

import Banner from "../../../public/ASSETS/contact-banner-1.webp";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import { sanitizeName, sanitizePhone, isValidName, isValidPhone, NAME_ERROR, PHONE_ERROR } from "@/utils/validation";

type ContactForm = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialFormData: ContactForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

// Department phone numbers — kept in sync with the site footer / "Visit Us"
// block by reading the same SITE_SETTINGS.contact source (admin-editable).
const DEFAULT_CONTACT = {
  generalEnquiry: "+91- 90707 99 700",
  primePharma: "+91- 90707 99 770",
  arenaBooking: "+91- 90707 99 079",
  oxygymBooking: "+91- 90707 99 709",
  email: "info@primepromenade.com",
};

const telHref = (v: string) => `tel:${v.replace(/[^\d+]/g, "")}`;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactClient() {
  const [formData, setFormData] = useState<ContactForm>(initialFormData);
  const { isSubmitting, submitMessage, submitError, setSubmitError, runSubmit } = useFormSubmit();

  // Pull the department phone numbers from site settings so the contact page
  // always matches the footer / "Visit Us" block (falls back to defaults).
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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const nextValue =
      name === "fullName"
        ? sanitizeName(value)
        : name === "phone"
        ? sanitizePhone(value)
        : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidName(formData.fullName)) {
      setSubmitError(NAME_ERROR);
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setSubmitError(PHONE_ERROR);
      return;
    }
    runSubmit(
      async () => {
        await apiCall(ENDPOINTS.CONTACT_ENQUIRIES, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setFormData(initialFormData);
      },
      "Message sent — we'll get back to you soon.",
      "Failed to send message. Please try again."
    );
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO (Section 1 - Odd) ═══ */}
      <motion.section
        className="relative w-full overflow-hidden h-[450px] md:min-h-[100svh] lg:min-h-[730px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <img
          src={Banner.src}
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47%,rgba(0,0,0,0.9) 100%)",
          }}
        ></div>

        <div className="site-container relative h-full md:min-h-[100svh] lg:min-h-[730px] flex flex-col items-center justify-end !pb-16 md:!pb-20 !pt-32 md:!pt-40 text-center w-full">

          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-normal leading-tight tracking-[-0.02em] text-white mb-4 md:mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[553px] px-2 sm:px-0"
          >
            We&apos;re here to help. Reach out to us for any questions, support,
            or service enquiries.
          </motion.p>
        </div>
      </motion.section>

      {/* ═══ INFO CARDS (Section 2 - Even - 120px Padding) ═══ */}
      <motion.section
        className="site-container py-[120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
        >
          {/* Address */}
          <motion.div
            variants={fadeUp}
            whileHover={{ translateY: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320 }}
            className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px]"
          >
            <FiMapPin
              className="w-10 h-10 md:w-[60px] md:h-[60px] text-[#604b9e] flex-shrink-0"
              strokeWidth={1.5}
            />
            <p className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0">
              Address
            </p>
            <a
              href="https://maps.google.com/?q=123+Business+Street,+Suite+100,+New+York,+NY+10001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] leading-[1.35] text-black hover:text-[#604b9e] hover:underline transition-colors"
            >
              Near Reliance Petrol Station, Puzhakkal, Thrissur, Kerala 680553
            </a>
          </motion.div>

          {/* Phone Number */}
          <motion.div
            variants={fadeUp}
            whileHover={{ translateY: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320 }}
            className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px]"
          >
            <FiPhone
              className="w-10 h-10 md:w-[54px] md:h-[54px] text-[#604b9e] flex-shrink-0"
              strokeWidth={1.5}
            />
            <p className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0">
              Phone Number
            </p>
            <div className="text-[13px] leading-[1.35] flex flex-col gap-1">
              <a
                href="tel:+919562837777"
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                +91- 956 283 7777
              </a>
              <a
                href="tel:18001212365"
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                Toll Free: 1800 1212 365
              </a>
              <a
                href={telHref(contact.generalEnquiry)}
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                General Enquiry: {contact.generalEnquiry}
              </a>
              <a
                href={telHref(contact.primePharma)}
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                Prime Pharma: {contact.primePharma}
              </a>
              <a
                href={telHref(contact.arenaBooking)}
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                Primex Arena Booking: {contact.arenaBooking}
              </a>
              <a
                href={telHref(contact.oxygymBooking)}
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                OXYGYM Booking: {contact.oxygymBooking}
              </a>
            </div>
          </motion.div>

          {/* Email Address */}
          <motion.div
            variants={fadeUp}
            whileHover={{ translateY: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320 }}
            className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px]"
          >
            <FiMail
              className="w-10 h-10 md:w-[56px] md:h-[56px] text-[#604b9e] flex-shrink-0"
              strokeWidth={1.5}
            />
            <p className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0">
              Email Address
            </p>
            <div className="text-[13px] leading-[1.35] flex flex-col gap-1">
              <a
                href="mailto:info@primepromenade.com"
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                info@primepromenade.com
              </a>
              <a
                href="mailto:contact@primepromenade.com"
                className="text-black hover:text-[#604b9e] hover:underline transition-colors"
              >
                contact@primepromenade.com
              </a>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            variants={fadeUp}
            whileHover={{ translateY: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320 }}
            className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-12 gap-3 md:gap-5 min-h-[280px] md:min-h-[383px]"
          >
            <FiClock
              className="w-10 h-10 md:w-[54px] md:h-[54px] text-[#604b9e] flex-shrink-0"
              strokeWidth={1.5}
            />
            <p className="text-xl md:text-2xl font-medium leading-[1.35] mt-2 md:mt-0">
              Working Hours
            </p>
            <p className="text-[13px] leading-[1.35] text-black">
              Monday - Friday:
              <br className="md:hidden" /> 9:00 AM - 10:00 PM
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══ SEND US A MESSAGE (Section 3 - Odd - Standard Padding) ═══ */}
      <motion.section
        className="site-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <div className="text-center mb-8 md:mb-10">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4"
          >
            Send us a Message
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base md:text-xl leading-[1.35] text-black/80 max-w-2xl mx-auto"
          >
            Fill out the form below and we&apos;ll get back to you as soon as
            possible.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          className="bg-white rounded-[24px] md:rounded-[30px] shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] p-6 sm:p-8 lg:p-12 xl:p-16"
        >
          <form className="flex flex-col gap-6 md:gap-8" onSubmit={handleSubmit}>
            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">
                  Full Name*
                </label>
                <div
                  className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]"
                  style={{ background: "#f0f0f0" }}
                >
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">
                  Email Address
                </label>
                <div
                  className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]"
                  style={{ background: "#f0f0f0" }}
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com (optional)"
                    className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone + Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">
                  Phone Number*
                </label>
                <div
                  className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]"
                  style={{ background: "#f0f0f0" }}
                >
                  <input
                    type="tel"
                    name="phone"
                    required
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter full phone number"
                    className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-base md:text-xl capitalize leading-[1.35]">
                  Subject *
                </label>
                <div
                  className="rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 md:h-[80px]"
                  style={{ background: "#f0f0f0" }}
                >
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter subject"
                    className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none placeholder:text-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Message */}
            <div className="flex flex-col gap-2 md:gap-3">
              <label className="text-base md:text-xl capitalize leading-[1.35]">
                Message
              </label>
              <div
                className="rounded-[24px] md:rounded-[33px] flex items-start px-5 md:px-6 py-4 md:py-6 min-h-[120px] md:min-h-[159px]"
                style={{ background: "#f0f0f0" }}
              >
                <textarea
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any special requirements and needs"
                  className="w-full bg-transparent text-base md:text-lg text-black/80 font-light outline-none resize-none placeholder:not-italic placeholder:text-black/40"
                ></textarea>
              </div>
            </div>

            {submitMessage && (
              <p className="text-base text-green-700 bg-green-50 rounded-2xl px-5 py-3">
                {submitMessage}
              </p>
            )}
            {submitError && (
              <p className="text-base text-red-700 bg-red-50 rounded-2xl px-5 py-3">
                {submitError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] transition-transform active:scale-95 h-14 md:h-[70px] disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </motion.div>
      </motion.section>

      {/* ═══ OUR LOCATION (Section 4 - Even - 120px Padding) ═══ */}
      <motion.section
        className="site-container !py-16 md:!py-24 lg:!py-[120px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
      >
        <div className="text-center mb-8 md:mb-10">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4"
          >
            Our Location
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base md:text-xl leading-[1.35] text-black/80"
          >
            Visit us at our office or find us on the map below.
          </motion.p>
        </div>

        {/* Map with overlay card */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-[24px] md:rounded-[30px] overflow-hidden shadow-[0px_0px_81.6px_0px_rgba(0,0,0,0.1)] min-h-[400px] md:min-h-[444px]"
        >
          {/* Google Maps Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35097.44751982927!2d76.18127199999999!3d10.5466184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ee82ffffffff%3A0xcdf52dea6dd085c8!2sPrime%20Roofing%20Solutions%20Pvt%20Ltd!5e1!3m2!1sen!2sin!4v1774844249410!5m2!1sen!2sin"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Prime Promenade Location"
          />

          {/* Overlay card */}
          <div className="absolute left-4 right-4 bottom-4 md:bottom-auto md:left-auto md:right-6 md:top-6 bg-white rounded-[20px] md:rounded-[26px] px-5 py-4 md:px-6 md:py-5 flex flex-col gap-1 shadow-md w-auto md:min-w-[280px] md:max-w-[360px]">
            <div className="flex items-start justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <p className="text-lg md:text-xl font-semibold leading-[1.35] mb-1 text-black">
                  Prime Promenade
                </p>
                <p className="text-sm md:text-base leading-[1.35] text-black/80">
                  Near Reliance Petrol Station, Puzhakkal,
                  Thrissur, Kerala 680553
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Prime+Roofing+Solutions+Pvt+Ltd,Puzhakkal,Thrissur,Kerala"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#e3e9e8] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0 pt-0"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-[#00372f]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
