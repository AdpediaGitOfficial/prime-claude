"use client";

import Banner from "../../../public/ASSETS/vendor-main-banner.webp";

import { MotionDiv } from "@/components/MotionWrappers";
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import { useState, type ChangeEvent, type FormEvent } from "react";

type VendorInviteForm = {
  fullName: string;
  phone: string;
  email: string;
  organisationName: string;
  vendorType: string;
  additionalRequirements: string;
  termsAccepted: boolean;
};

const initialFormData: VendorInviteForm = {
  fullName: "",
  phone: "",
  email: "",
  organisationName: "",
  vendorType: "",
  additionalRequirements: "",
  termsAccepted: false,
};

export default function VendorPage() {
  const [formData, setFormData] = useState<VendorInviteForm>(initialFormData);
  const { isSubmitting, submitMessage, submitError, runSubmit } = useFormSubmit();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    runSubmit(
      async () => {
        await apiCall(ENDPOINTS.VENDOR_INVITES, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setFormData(initialFormData);
      },
      "Vendor invite request sent successfully.",
      "Failed to send vendor invite request."
    );
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO (Section 1 - Odd) ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:min-h-[100vh] lg:min-h-[100vh]">
        <img
          src={Banner.src}
          alt="Vendor Zone"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 48%,rgba(0,0,0,0.9) 100%)",
          }}
        ></div>
        {/* Applied site-container for horizontal padding, keeping specific vertical padding overrides for the Hero */}
        <div className="site-container relative h-full md:min-h-[100vh] lg:min-h-[100vh] flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full">
      
           <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mb-6"
          >
            
          </MotionDiv>
          <h1 className="text-white text-3xl sm:text-5xl lg:text-[76px] font-normal leading-[1.15]">
            Vendor Invite
          </h1>
        </div>
      </section>

      <section className="site-container w-full py-12 sm:py-16 lg:py-24">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 items-start">
          {[
            { src: "/ASSETS/vendor_1.jpg", alt: "Calling vendors for Prime Promenade" },
            { src: "/ASSETS/vendor_2.jpg", alt: "Calling vendors for fashion and gift product dealers" },
            { src: "/ASSETS/vendor_3.jpg", alt: "Calling vendors for diet and protein product dealers" },
          ].map((image) => (
            <div key={image.src} className="w-full min-w-0 overflow-hidden bg-white shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
              <img
                src={image.src}
                alt={image.alt}
                className="block w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="site-container w-full pb-16 sm:pb-20 lg:pb-28">
        <div className="mb-7 text-center">
          <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-2">
            Booking Enquiry Form
          </h2>
          <p className="text-sm md:text-base text-black/70">
            Fill in your details to submit a booking request
          </p>
        </div>

        <div className="w-full rounded-[18px] bg-[#dfe8e6] p-4 sm:p-7 md:p-10">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
                Full Name*
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                  className="w-full min-w-0 h-12 md:h-14 rounded-full bg-white px-5 text-sm md:text-base font-normal text-black outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/15"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
                Phone Number*
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full min-w-0 h-12 md:h-14 rounded-full bg-white px-5 text-sm md:text-base font-normal text-black outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/15"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your@Email.Com (optional)"
                  className="w-full min-w-0 h-12 md:h-14 rounded-full bg-white px-5 text-sm md:text-base font-normal text-black outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/15"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
                Organisation Name*
                <input
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter organisation name"
                  className="w-full min-w-0 h-12 md:h-14 rounded-full bg-white px-5 text-sm md:text-base font-normal text-black outline-none placeholder:text-black/35 focus:ring-2 focus:ring-black/15"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
              Vendor Type*
              <select
                name="vendorType"
                value={formData.vendorType}
                onChange={handleInputChange}
                required
                className="w-full min-w-0 h-12 md:h-14 rounded-full bg-white px-5 pr-12 text-sm md:text-base font-normal text-black/60 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-black/15"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L7 7L13 1' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundPosition: "right 22px center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="" disabled>
                  Select vendor type
                </option>
                <option value="Fashion">Fashion</option>
                <option value="Food & Beverage">Food &amp; Beverage</option>
                <option value="Health & Wellness">Health &amp; Wellness</option>
                <option value="Retail Products">Retail Products</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm md:text-base font-medium text-black">
              Additional Requirements
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                placeholder="Any special requirements and needs"
                className="w-full min-w-0 min-h-[120px] rounded-[18px] bg-white px-5 py-4 text-sm md:text-base font-normal text-black outline-none resize-none placeholder:text-black/35 focus:ring-2 focus:ring-black/15"
              ></textarea>
            </label>

            <div className="border-t border-black/10 pt-5">
              <label className="flex items-start gap-3 text-xs md:text-sm leading-[1.35] text-black cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-black cursor-pointer"
                />
                <span>
                  I Agree To The Vendor Booking Terms And Conditions*
                  <br />
                  <span className="text-black/70">
                    Booking will be confirmed only after owner approval
                  </span>
                </span>
              </label>
            </div>

            {(submitMessage || submitError) && (
              <p className={`text-sm md:text-base ${submitError ? "text-red-600" : "text-black"}`}>
                {submitError || submitMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 md:h-14 rounded-full bg-black text-white text-sm md:text-base font-medium transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
