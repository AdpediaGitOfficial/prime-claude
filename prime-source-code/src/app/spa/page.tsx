"use client";

import SpaTimeSlots from "@/components/SpaTimeSlots";
import DatePicker from "@/components/DatePicker";
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
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useState, type ChangeEvent, type FormEvent } from "react";

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
  selectedService: "Spa Massage",
  date: "",
  preferredTime: "10:00 am",
  message: "",
};

const spaServices = [
  { name: "Spa Massage", img: Luxurymessage.src },
  { name: "Salon and Hairstyling", img: Saloon.src },
  { name: "Facial and Skin Care", img: Facialtreatment.src },
  { name: "Nail Spa", img: Manicure.src },
  { name: "Hair Treatment", img: Hairtherapy.src },
  { name: "Aromatherapy", img: Aromatherapy.src },
  { name: "Cleanup Services", img: Wellnesstherapy.src },
  { name: "Manicure and Pedicure", img: ManicurePedicure.src },
];

export default function SpaPage() {
  const [formData, setFormData] = useState<SpaBookingForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!formData.date) {
      setSubmitError("Please select an appointment date.");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiCall(ENDPOINTS.SPA_BOOKINGS, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSubmitMessage("Spa booking request sent successfully.");
      setFormData(initialFormData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to send spa booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">

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
        <button type="button" onClick={() => handleServiceSelect(service.name)} className="w-full h-[48px] bg-black text-white rounded-full text-lg font-medium transition-all hover:scale-[0.98]">
          Book Now
        </button>
      </div>
    ))}
  </div>
</section>

      {/* ═══ CHOOSE YOUR TIME SLOT (Standard Padding) ═══ */}
      <section className="site-container">
        <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8">Choose Your Time Slot</h2>
        <div className="rounded-[24px] md:rounded-[30px] py-8 md:py-10 px-5 sm:px-8 lg:px-12" style={{ background: "#f1eaf3" }}>
          <p className="text-lg md:text-[22px] capitalize leading-[1.2] mb-3 md:mb-4">Date</p>
          <div className="mb-6 md:mb-8">
            <DatePicker onDateChange={handleDateChange} />
          </div>
          <SpaTimeSlots onSlotChange={handleSlotChange} />
        </div>
      </section>

      {/* ═══ COMPLETE YOUR BOOKING (Alternating Section 2 - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">Complete Your Booking</h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-[550px] mx-auto text-black/80">
            Fill in your details to confirm the appointment
          </p>
        </div>
        
        <div className="rounded-[24px] md:rounded-[30px] p-5 sm:p-8 lg:p-12" style={{ background: "#f1eaf3" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
            
            {/* Row 1 */}
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Full Name*</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize" />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Email Address*</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Phone Number*</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter full phone number" className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize" />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Selected Service*</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 relative h-14 sm:h-16 md:h-[80px]">
                  <select name="selectedService" value={formData.selectedService} onChange={handleInputChange} required className="w-full bg-transparent text-base md:text-lg text-black font-light outline-none capitalize appearance-none cursor-pointer pr-8">
                    {spaServices.map((service) => (
                      <option key={service.name}>{service.name}</option>
                    ))}
                  </select>
                  <svg className="absolute right-5 md:right-6 w-3 h-4 md:h-5 pointer-events-none" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Preferred Time*</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 relative h-14 sm:h-16 md:h-[80px]">
                  <select name="preferredTime" value={formData.preferredTime} onChange={handleInputChange} required className="w-full bg-transparent text-base md:text-lg text-black font-light outline-none capitalize appearance-none cursor-pointer pr-8">
                    <option>10:00 am</option>
                    <option>11:00 am</option>
                    <option>12:00 pm</option>
                    <option>1:00 pm</option>
                    <option>2:00 pm</option>
                    <option>3:00 pm</option>
                    <option>4:00 pm</option>
                    <option>5:00 pm</option>
                    <option>6:00 pm</option>
                    <option>7:00 pm</option>
                    <option>8:00 pm</option>
                    <option>9:00 pm</option>
                  </select>
                  <svg className="absolute right-5 md:right-6 w-3 h-4 md:h-5 pointer-events-none" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">Message (Optional)</p>
                <div className="bg-white rounded-[20px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
                  <input type="text" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your goals and interest" className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize" />
                </div>
              </div>
            </div>

            {(submitMessage || submitError) && (
              <p className={`text-sm md:text-lg ${submitError ? "text-red-600" : "text-black"}`}>
                {submitError || submitMessage}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] mt-2 h-14 sm:h-16 md:h-[70px] transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
            
          </form>
        </div>
      </section>

    </div>
  );
}
