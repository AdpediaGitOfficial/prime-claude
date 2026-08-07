"use client";

import Gymabout from "../../../public/ASSETS/oxygym.jpeg";
import {
  MotionDiv,
  MotionH2,
  MotionP,
  MotionSpan,
} from "@/components/MotionWrappers";
import { PiSparkleFill } from "react-icons/pi";
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import {
  sanitizeName,
  sanitizePhone,
  isValidName,
  isValidPhone,
  NAME_ERROR,
  PHONE_ERROR,
} from "@/utils/validation";
import { useState, type ChangeEvent, type FormEvent } from "react";

type GymMembershipForm = {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  message: string;
};

const initialFormData: GymMembershipForm = {
  fullName: "",
  phone: "",
  email: "",
  age: "",
  message: "",
};

function CheckIconGym() {
  return (
    <span className="inline-block flex-shrink-0 w-[33px] h-[33px] rounded-full bg-gym/20 flex items-center justify-center">
      <svg
        className="w-4 h-4 text-gym"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function CheckIconSm() {
  return (
    <span className="inline-flex flex-shrink-0 w-[19px] h-[19px] items-center justify-center">
      <svg
        className="w-[19px] h-[19px] text-gym"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function GymPage() {
  const [formData, setFormData] = useState<GymMembershipForm>(initialFormData);
  const { isSubmitting, submitMessage, submitError, setSubmitError, runSubmit } =
    useFormSubmit();

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

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
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
        await apiCall(ENDPOINTS.GYM_MEMBERSHIPS, {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            age: Number(formData.age),
          }),
        });
        setFormData(initialFormData);
      },
      "Membership request sent successfully.",
      "Failed to send membership request."
    );
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:h-screen lg:min-h-[100vh]">
        <img
          src="/ASSETS/gym-slider-innerpage.webp"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 48%,rgba(0,0,0,0.9) 100%)" }}
        ></div>

        <MotionDiv
          className="site-container relative h-full lg:min-h-[100vh] flex flex-col items-center justify-end pb-16 md:pb-24 pt-32 md:pt-40 text-center w-full"
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
            <img src="/Service-logo/final-out-03.png" alt="Oxy Gym" className="mx-auto w-[160px] md:w-[220px] object-contain" />
          </MotionDiv>

          <MotionP
            className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[830px] px-2 sm:px-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.6 }}
          >
            Your comeback starts here.
          </MotionP>
        </MotionDiv>
      </section>

      {/* ═══ ABOUT OUR GYM ═══ */}
      <section className="site-container section-y">
        {/* 1. Changed items-center to items-stretch so the columns match heights */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-stretch">
          {/* Image LEFT */}
          {/* 2. Replaced fixed lg:h-[554px] with lg:h-full so the image spans the content height */}
          <div className="rounded-[20px] lg:rounded-[26px] overflow-hidden h-[300px] sm:h-[400px] lg:h-full w-full">
            <img
              src={Gymabout.src}
              alt="About Our Gym"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text RIGHT */}
          {/* 3. Added flex/justify-center to center the text vertically within its matched column */}
          <div className="flex flex-col justify-center py-4 lg:py-8">
            <MotionH2
              className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-4 md:mb-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              About OXY GYM
            </MotionH2>

        

            <div className="flex flex-col gap-4 md:gap-[22px]">
              {/* List Item 1 */}
              <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                 Cardio zone with greenery
                </MotionP>
              </div>

              {/* List Item 2 */}
              <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                 Highly certified general and personal trainers

                </MotionP>
              </div>

                 <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                International standard equipments

                </MotionP>
              </div>

                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                Dedicated oxygen zone
                </MotionP>
              </div>

                  <div className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1">
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                CrossFit.
                <span className="block text-sm md:text-base text-black/50 mt-0.5">(Dedicated area for Kid&apos;s Gym, Zumba, Yoga)</span>
                </MotionP>
              </div>

                  <div className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1">
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                Physiotherapy with Hydrotherapy
                <span className="block text-sm md:text-base text-black/50 mt-0.5">(Coming Soon)</span>
                </MotionP>
              </div>

                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                6000 sq feet gym area
                </MotionP>
              </div>

                   <div className="flex items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1 md:mt-0">
                  {/* 4. Added React Icon with matching green color and sizing */}
                  <PiSparkleFill className="text-[#6CB443] text-2xl md:text-[32px]" />
                </div>
                <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
                6:00 AM to 10:00 PM
                </MotionP>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WORLD-CLASS EQUIPMENT ═══ */}
      <section className="site-container">
        <div
          className="rounded-[24px] md:rounded-[30px] md:py-16 py-8 px-5 sm:px-8 lg:px-16"
          style={{ background: "rgba(108,190,70,0.2)" }}
        >
          {/* <MotionDiv
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MotionH2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
              World-Class Equipment
            </MotionH2>
            <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-[495px] mx-auto">
              Our facility features state-of-the-art equipment for all your
              fitness needs
            </MotionP>
          </MotionDiv> */}

          {/* 2x2 Equipment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {/* Strength Training Machines */}
            <MotionDiv
              className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[280px] sm:h-[320px] md:h-[421px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
            >
              <img
                src="/ASSETS/Strength_Training_Machines.webp"
                alt="Strength Training"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              ></div>
         
            </MotionDiv>

            {/* Free Weight Area */}
            <MotionDiv
              className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[280px] sm:h-[320px] md:h-[421px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
            >
              <img
                src="/ASSETS/Free_Weight_Area.webp"
                alt="Free Weight Area"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              ></div>
           
            </MotionDiv>

            {/* Cardio Equipment */}
            <MotionDiv
              className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[280px] sm:h-[320px] md:h-[421px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
            >
              <img
                src="/ASSETS/Cardio_Equipment.webp"
                alt="Cardio Equipment"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              ></div>
            
            </MotionDiv>

            {/* Functional Training Space */}
            <MotionDiv
              className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[280px] sm:h-[320px] md:h-[421px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
            >
              <img
                src="/ASSETS/Functional_Training_Space.webp"
                alt="Functional Training"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                }}
              ></div>
             
            </MotionDiv>
          </div>
        </div>
      </section>


      {/* ═══ JOIN US TODAY ═══ */}
      <section className="site-container section-y">
        <MotionDiv
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MotionH2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
            Join Us Today
          </MotionH2>
          <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
            Start your fitness journey by registering for membership
          </MotionP>
        </MotionDiv>

        {/* Important Notice Banner */}
        <div
          className="rounded-[20px] md:rounded-[30px] px-5 py-6 md:px-8 md:py-8 mb-8 md:mb-10 flex flex-col gap-3 md:gap-4"
          style={{ background: "rgba(226,242,218,0.3)" }}
        >
          <p className="text-2xl md:text-[30px] font-medium leading-[1.2]">
            Important Notice
          </p>
          <p className="text-base md:text-xl leading-[1.35]">
            Membership registration through the website is for initial
            application only. Payments and renewals are handled offline at the
            facility.
          </p>
        </div>

        {/* Form + Process Steps */}
        <div className="grid lg:grid-cols-[1fr_449px] gap-6 md:gap-8">
          {/* Membership Registration Form */}
          <div
            className="rounded-[20px] md:rounded-[30px] p-5 sm:p-8 lg:p-10"
            style={{ background: "#e2f2da" }}
          >
            <h3 className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-2">
              Membership Registration
            </h3>
            <p className="text-base md:text-xl leading-[1.35] mb-6 md:mb-8">
              Fill in your details to get started
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
              {/* Row 1: Full Name + Phone Number */}
              <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="gym-fullName" className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3 block">
                    full name*
                  </label>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="text"
                      id="gym-fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter full name"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gym-phone" className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3 block">
                    phone number*
                  </label>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="tel"
                      id="gym-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter phone number"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email + Age */}
              <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="gym-email" className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3 block">
                    email address
                  </label>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="email"
                      id="gym-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com (optional)"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gym-age" className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3 block">
                    age*
                  </label>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="number"
                      id="gym-age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Enter your age"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Message */}
              <div>
                <label htmlFor="gym-message" className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3 block">
                  message
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-start px-5 md:px-6 py-4 md:py-5 min-h-[100px] sm:min-h-[120px] md:min-h-[159px]">
                  <textarea
                    id="gym-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="any special requirements and needs"
                    className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none resize-none placeholder:capitalize"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              {(submitMessage || submitError) && (
                <p className={`text-sm md:text-lg ${submitError ? "text-red-600" : "text-black"}`}>
                  {submitError || submitMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] h-14 sm:h-16 md:h-[70px] mt-2 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

          {/* Registration Process Steps */}
          <div
            className="rounded-[20px] md:rounded-[30px] p-5 sm:p-8 lg:p-10 h-fit"
            style={{ background: "#e2f2da" }}
          >
            <h3 className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-6 md:mb-8">
              Gym Rules &amp; Guidelines
            </h3>
            <div className="flex flex-col gap-6 md:gap-8">
              <ul className="list-disc list-inside grid gap-2 text-base md:text-xl leading-[1.35]">
                <li>Proper gym attire &amp; training shoes required</li>
                <li>Outside footwear not allowed</li>
                <li>Carry separate gym shoes</li>
                <li>Use towels during workouts</li>
                <li>Re-rack weights after use</li>
                <li>Handle equipment responsibly</li>
                <li>Maintain cleanliness &amp; hygiene</li>
                <li>No food or smoking inside</li>
                <li>Respect members &amp; staff</li>
                <li>Follow trainer instructions</li>
                <li>Children must be supervised</li>
                <li>Management not liable for personal belongings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
