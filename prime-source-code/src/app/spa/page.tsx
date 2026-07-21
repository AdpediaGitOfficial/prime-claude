"use client";

import Banner from "../../../public/SPA/meglow-banner.jpeg"
import Facialtreatment from "../../../public/SPA/spa-card-3.webp"
import Manicure from "../../../public/SPA/spa-card-4.webp"
import Luxurymessage from "../../../public/SPA/spa-card-1.webp"
import Wellnesstherapy from "../../../public/ASSETS/spa-service-3.jpg"
import Hairtherapy from "../../../public/ASSETS/spa-service-1.jpg"
import Aromatherapy from "../../../public/SPA/spa-card-5.webp"
import Saloon from "../../../public/SPA/spa-card-2.webp"
import ManicurePedicure from "../../../public/SPA/manicure-pedicure.jpg"
import { MotionDiv} from "@/components/MotionWrappers";
import { apiCall, ENDPOINTS, assetUrl } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import { useState, useMemo, useEffect, type ChangeEvent, type FormEvent } from "react";

// Hourly appointment times 10:00 AM – 9:00 PM
const TIME_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const h = 10 + i;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:00 ${ampm}`;
});

type SpaBookingForm = {
  fullName: string;
  email: string;
  phone: string;
  selectedService: string;
  date: string;
  preferredTime: string;
  message: string;
};

const initialFormData: SpaBookingForm = {
  fullName: "",
  email: "",
  phone: "",
  selectedService: "",
  date: "",
  preferredTime: "",
  message: "",
};

type SpaService = { name: string; img: string };

// Default services (fallback if the API is unreachable). Their photos stay
// keyed by name so admin-managed services keep the right image.
const DEFAULT_SPA_SERVICES: SpaService[] = [
  { name: "Spa Massage", img: Luxurymessage.src },
  { name: "Salon and Hairstyling", img: Saloon.src },
  { name: "Facial and Skin Care", img: Facialtreatment.src },
  { name: "Nail Spa", img: Manicure.src },
  { name: "Hair Treatment", img: Hairtherapy.src },
  { name: "Aromatherapy", img: Aromatherapy.src },
  { name: "Cleanup Services", img: Wellnesstherapy.src },
  { name: "Manicure and Pedicure", img: ManicurePedicure.src },
];

const SPA_IMAGE_BY_NAME: Record<string, string> = Object.fromEntries(
  DEFAULT_SPA_SERVICES.map((s) => [s.name, s.img])
);
const SPA_FALLBACK_IMG = DEFAULT_SPA_SERVICES[0].img;

export default function SpaPage() {
  const [formData, setFormData] = useState<SpaBookingForm>(initialFormData);
  // Live service list from the admin (falls back to defaults if unreachable).
  const [spaServices, setSpaServices] = useState<SpaService[]>(DEFAULT_SPA_SERVICES);
  useEffect(() => {
    let active = true;
    apiCall(`${ENDPOINTS.LISTINGS}?type=SPA_SERVICE`)
      .then((rows) => {
        if (!active || !Array.isArray(rows)) return;
        const mapped = rows
          .filter((r) => r && typeof r.name === "string")
          .map((r) => ({
            name: r.name as string,
            // Admin-set image wins; else the photo for a known service; else fallback.
            img: assetUrl(r.metadata?.image) || SPA_IMAGE_BY_NAME[r.name] || SPA_FALLBACK_IMG,
          }));
        if (mapped.length) setSpaServices(mapped);
      })
      .catch(() => {
        /* keep DEFAULT_SPA_SERVICES */
      });
    return () => {
      active = false;
    };
  }, []);
  const { isSubmitting, submitMessage, submitError, setSubmitMessage, setSubmitError, runSubmit } =
    useFormSubmit();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleServiceSelect = (serviceName: string) => {
    setFormData((current) => ({
      ...current,
      selectedService: serviceName,
    }));
  };

  // "Book Now" on a service card: select it and jump to the date/time step.
  const handleBookNow = (serviceName: string) => {
    handleServiceSelect(serviceName);
    document
      .getElementById("spa-booking")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Next 7 selectable days as chips (value is a human-readable label).
  const dateOptions = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return {
        label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
        dow: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
        dnum: d.getDate(),
      };
    });
  }, []);

  const handleDateChange = (date: string) => {
    setFormData((current) => ({
      ...current,
      date,
    }));
  };

  const handleSlotChange = (preferredTime: string) => {
    setFormData((current) => ({
      ...current,
      preferredTime,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!formData.selectedService) {
      setSubmitError("Please choose a service.");
      return;
    }
    if (!formData.date) {
      setSubmitError("Please select an appointment date.");
      return;
    }
    if (!formData.preferredTime) {
      setSubmitError("Please select an appointment time.");
      return;
    }

    runSubmit(
      async () => {
        await apiCall(ENDPOINTS.SPA_BOOKINGS, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setFormData(initialFormData);
      },
      "Spa booking request sent successfully.",
      "Failed to send spa booking request."
    );
  };

  return (
    <div className="bg-white text-black overflow-x-clip">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100vh] lg:min-h-[100vh]">
        <img
          src={Banner.src}
          alt="Salon &amp; Spa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 48%,rgba(0,0,0,0.9) 100%)" }}
        ></div>
        
        {/* Applied site-container for horizontal padding, keeping specific vertical padding overrides for the Hero */}
        <MotionDiv
          className="site-container relative h-full md:min-h-[100vh] lg:min-h-[100vh] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
       

        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mb-6"
          >
            <img src="/LOGO/final-out-10.webp" alt="spa" className="mx-auto w-[180px] md:w-[400px] object-contain" />
          </MotionDiv>

          {/* <MotionP className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[825px] px-2 sm:px-0" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18, duration: 0.6 }}>
            Experience beauty and relaxation. Our team offers premium salon and spa services to rejuvenate your body and mind in a luxurious setting.
          </MotionP> */}
        </MotionDiv>
      </section>

      {/* ═══ OUR SERVICES (Alternating Section 1 - 120px Padding) ═══ */}
      <section className="site-container py-16 lg:py-24">
  <h2 className="text-3xl md:text-[40px] font-normal mb-3">
    Our Services
  </h2>

  <p className="text-lg text-black/70 mb-10">
    Choose from our curated selection of premium salon and spa treatments
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {spaServices.map((service) => (
      <div
        key={service.name}
        className="bg-[#F2EDF4] rounded-3xl p-3"
      >
        {/* Image */}
        <div className="overflow-hidden rounded-2xl">
          {service.img ? (
            <img
              src={service.img}
              alt={service.name}
              className="w-full h-[240px] object-cover"
            />
          ) : (
            <div className="w-full h-[240px] bg-black"></div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-medium mt-4 mb-4">
          {service.name}
        </h3>

        {/* Button */}
        <button type="button" onClick={() => handleBookNow(service.name)} className="w-full h-[48px] bg-black text-white rounded-full text-lg font-medium transition-all hover:scale-[0.98]">
          Book Now
        </button>
      </div>
    ))}
  </div>
</section>

      {/* ═══ BOOK YOUR APPOINTMENT (date/time + details + summary) ═══ */}
      <section id="spa-booking" className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          {/* LEFT: steps */}
          <div className="flex flex-col gap-6">
            {/* Step 2: date & time */}
            <div className="bg-white border border-black/10 rounded-[24px] md:rounded-[30px] p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex-none w-7 h-7 rounded-full bg-[#5b2d82] text-white text-sm font-bold flex items-center justify-center">2</span>
                <h3 className="text-xl md:text-2xl font-medium">Pick date &amp; time</h3>
              </div>
              <p className="text-sm text-black/55 mb-6 pl-10">Choose when you&rsquo;d like to visit.</p>

              <p className="text-sm font-semibold mb-3">Date</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dateOptions.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => handleDateChange(o.label)}
                    aria-pressed={formData.date === o.label}
                    className={`flex-none min-w-[62px] text-center rounded-[14px] px-3 py-2 border transition-colors ${formData.date === o.label ? "bg-[#5b2d82] text-white border-[#5b2d82]" : "bg-white border-black/15 hover:border-[#5b2d82]"}`}
                  >
                    <span className={`block text-[11px] uppercase tracking-wide ${formData.date === o.label ? "text-white/80" : "text-black/50"}`}>{o.dow}</span>
                    <span className="block text-lg font-bold">{o.dnum}</span>
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold mt-6 mb-3">Available times</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSlotChange(t)}
                    aria-pressed={formData.preferredTime === t}
                    className={`rounded-[12px] border px-3 py-2.5 text-sm font-semibold text-center transition-colors ${formData.preferredTime === t ? "bg-[#5b2d82] text-white border-[#5b2d82]" : "bg-white border-black/15 hover:bg-[#f1eaf3]"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: details */}
            <div className="bg-white border border-black/10 rounded-[24px] md:rounded-[30px] p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex-none w-7 h-7 rounded-full bg-[#5b2d82] text-white text-sm font-bold flex items-center justify-center">3</span>
                <h3 className="text-xl md:text-2xl font-medium">Your details</h3>
              </div>
              <p className="text-sm text-black/55 mb-6 pl-10">So we can confirm your appointment.</p>

              <div className="bg-[#f1eaf3] rounded-[24px] p-5 sm:p-8">
                <form id="spa-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="spa-name" className="text-sm md:text-base">Full Name*</label>
                      <input id="spa-name" type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black outline-none placeholder-black/40 focus:ring-2 focus:ring-[#5b2d82]/25 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="spa-phone" className="text-sm md:text-base">Phone Number*</label>
                      <input id="spa-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter phone number" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black outline-none placeholder-black/40 focus:ring-2 focus:ring-[#5b2d82]/25 w-full" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="spa-email" className="text-sm md:text-base">Email Address*</label>
                      <input id="spa-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black outline-none placeholder-black/40 focus:ring-2 focus:ring-[#5b2d82]/25 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="spa-service" className="text-sm md:text-base">Selected Service*</label>
                      <div className="relative">
                        <select id="spa-service" name="selectedService" value={formData.selectedService} onChange={handleInputChange} required className="w-full bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black/80 outline-none appearance-none cursor-pointer pr-10 focus:ring-2 focus:ring-[#5b2d82]/25">
                          <option value="" disabled>Select a service</option>
                          {spaServices.map((s) => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-4 text-black" viewBox="0 0 13 7" fill="none"><path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="1.5" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="spa-message" className="text-sm md:text-base">Message (Optional)</label>
                    <input id="spa-message" type="text" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your goals and interest" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black outline-none placeholder-black/40 focus:ring-2 focus:ring-[#5b2d82]/25 w-full" />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT: appointment summary */}
          <aside className="lg:sticky lg:top-24 self-start bg-white border border-black/10 rounded-[24px] overflow-hidden shadow-md">
            <div className="bg-[#5b2d82] text-white px-6 py-5">
              <p className="text-lg font-medium">Your appointment</p>
              <p className="text-sm text-white/70 mt-0.5">Me Glow Wellness Lounge</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3.5 text-sm">
              <div className="flex justify-between gap-3"><span className="text-black/55">Service</span><span className={formData.selectedService ? "font-semibold text-right" : "text-black/45"}>{formData.selectedService || "Not selected"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/55">Date</span><span className={formData.date ? "font-semibold text-right" : "text-black/45"}>{formData.date || "Not selected"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/55">Time</span><span className={formData.preferredTime ? "font-semibold text-right" : "text-black/45"}>{formData.preferredTime || "Not selected"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/55">Name</span><span className={formData.fullName ? "font-semibold text-right" : "text-black/45"}>{formData.fullName || "—"}</span></div>
            </div>
            <div className="px-6 pb-5">
              {(submitMessage || submitError) && (
                <p className={`mb-3 text-sm ${submitError ? "text-red-600" : "text-[#5b2d82]"}`}>{submitError || submitMessage}</p>
              )}
              <button type="submit" form="spa-form" disabled={isSubmitting} className="w-full bg-[#5b2d82] text-white rounded-[16px] py-4 font-medium hover:bg-[#4a2069] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? "Confirming…" : "Confirm Booking"}
              </button>
              <p className="mt-3 text-xs text-black/50">We&rsquo;ll confirm your appointment by phone or email. No payment is taken online.</p>
            </div>
          </aside>
        </div>
      </section>

    </div>
  );
}
