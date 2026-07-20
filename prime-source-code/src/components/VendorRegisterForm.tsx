"use client";

import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import { useState, type ChangeEvent, type FormEvent } from "react";

type VendorRegisterFields = {
  organisationName: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDuration: string;
  additionalRequirements: string;
};

const initialFormData: VendorRegisterFields = {
  organisationName: "",
  fullName: "",
  phone: "",
  email: "",
  preferredDuration: "",
  additionalRequirements: "",
};

/**
 * "Register Your Interest" form on the /vendor page. Markup and styling are
 * unchanged from the original static form — this only wires it to submit to
 * the vendor-invites endpoint.
 */
export default function VendorRegisterForm() {
  const [formData, setFormData] = useState<VendorRegisterFields>(initialFormData);
  const { isSubmitting, submitMessage, submitError, runSubmit } = useFormSubmit();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
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
      "Enquiry submitted — our team will get back to you within 24 hours.",
      "Failed to submit enquiry. Please try again."
    );
  };

  return (
    <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit}>
      {/* Row 1: Business/Brand Name + Contact Person */}
      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Business/Brand Name*
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
            <input
              type="text"
              name="organisationName"
              required
              value={formData.organisationName}
              onChange={handleInputChange}
              placeholder="Enter business/brand name"
              className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
            />
          </div>
        </div>
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Contact Person*
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full name"
              className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Phone Number + Email Address */}
      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Phone Number*
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter full phone number"
              className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
            />
          </div>
        </div>
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Email Address*
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Preferred Booking Duration + Message */}
      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Preferred Booking Duration*
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 relative h-14 sm:h-16 md:h-[80px]">
            <select
              name="preferredDuration"
              required
              value={formData.preferredDuration}
              onChange={handleInputChange}
              className="w-full bg-transparent text-base md:text-lg text-black font-light outline-none capitalize appearance-none cursor-pointer pr-8"
            >
              <option value="" disabled>
                select booking duration
              </option>
              <option>1 Week</option>
              <option>1 Month</option>
              <option>1 Year</option>
            </select>
            <svg
              className="absolute right-5 md:right-6 w-3 h-4 md:h-5 pointer-events-none text-black"
              viewBox="0 0 13 7"
              fill="none"
            >
              <path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
            Message (Optional)
          </p>
          <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
            <input
              type="text"
              name="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={handleInputChange}
              placeholder="Tell us about your goals and interest"
              className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
            />
          </div>
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] mt-2 h-14 sm:h-16 md:h-[70px] transition-transform active:scale-95 disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
