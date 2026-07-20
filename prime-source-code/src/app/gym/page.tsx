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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    try {
      setIsSubmitting(true);
      await apiCall(ENDPOINTS.GYM_MEMBERSHIPS, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });

      setSubmitMessage("Membership request sent successfully.");
      setFormData(initialFormData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to send membership request.");
    } finally {
      setIsSubmitting(false);
    }
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
      <section className="site-container pt-[60px]">
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

      {/* ═══ MEMBERSHIP PACKAGES ═══ */}
      {/* <section className="site-container py-[120px]">
        <MotionH2
          className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-2 md:mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
        >
          Membership Packages
        </MotionH2>
        <MotionP
          className="text-base sm:text-lg md:text-xl leading-[1.35] mb-8 md:mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          Choose the plan that fits your fitness journey
        </MotionP>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">

          <div
            className="rounded-[24px] md:rounded-[30px] p-6 sm:p-8 lg:p-10 flex flex-col"
            style={{ background: "rgba(108,190,70,0.15)" }}
          >
            <h3 className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-2">
              Standard Membership
            </h3>
            <p className="text-base md:text-xl leading-[1.35] mb-6 md:mb-8 text-black/70">
              Perfect for getting started
            </p>

            <div className="flex flex-col gap-4 md:gap-5 mb-8 md:mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Access to gym equipment
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Standard workout hours
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Locker facility
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Monthly membership
                </p>
              </div>
            </div>

            <button className="mt-auto bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] h-14 md:h-[70px] transition-transform active:scale-95">
              Get Started
            </button>
          </div>

       
          <div
            className="rounded-[24px] md:rounded-[30px] p-6 sm:p-8 lg:p-10 relative flex flex-col"
            style={{ background: "rgba(108,190,70,0.25)" }}
          >
       
            <div className="absolute top-5 right-5 sm:top-6 sm:right-6 lg:top-8 lg:right-8 bg-[#6cbe46] rounded-[16px] md:rounded-[20px] px-3 py-1.5 sm:px-5 sm:py-2 flex items-center justify-center">
              <span className="text-white font-medium text-xs sm:text-sm md:text-xl capitalize leading-[1.2]">
                Premium
              </span>
            </div>

            <h3 className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-2 pr-20 sm:pr-24 lg:pr-0">
              Platinum Membership
            </h3>
            <p className="text-base md:text-xl leading-[1.35] mb-6 md:mb-8 text-black/70">
              Experience the ultimate fitness lifestyle
            </p>

            <div className="flex flex-col gap-4 md:gap-5 mb-8 md:mb-10 flex-1">
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Full gym access
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Priority entry
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Extended hours access
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Personal locker
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Exclusive swimming pool access
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Priority booking
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckIconSm />
                <p className="text-base md:text-lg lg:text-xl leading-[1.35]">
                  Premium member recognition
                </p>
              </div>
            </div>

            <button className="mt-auto bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] h-14 md:h-[70px] transition-transform active:scale-95">
              Join Premium
            </button>
          </div>
        </div>
      </section> */}

   
      {/* <section className="site-container">
        <div
          className="rounded-[30px] py-10 md:py-16 px-4 sm:px-8 lg:px-16"
          style={{ background: "#e2f2da" }}
        >
          <MotionDiv
            className="text-center mb-8 md:mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MotionH2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
              Gym Timings
            </MotionH2>
            <MotionP className="text-base sm:text-lg md:text-xl leading-[1.35]">
              We&apos;re open when you need us most
            </MotionP>
          </MotionDiv>

          <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center gap-6 lg:gap-[60px] mb-8">
      
            <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center w-full max-w-[589px] min-h-[120px] md:min-h-[197px] p-2 md:p-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 rounded-[16px] md:rounded-[21px] flex items-center justify-center bg-[#e2f2da] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[152px] md:h-[155px] m-2 sm:m-3 md:m-[21px]">
                <div className="rounded-full bg-[#6cbe46] flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 pr-3 md:pr-4 min-w-0 py-2">
                <p className="text-lg sm:text-xl md:text-[26px] lg:text-[30px] font-medium leading-[1.2]">
                  Morning Session
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.4] text-gray-800">
                  6:00 AM – 11:00 AM
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-[1.4] text-black/60">
                  Start your day with energy
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center w-full max-w-[589px] min-h-[120px] md:min-h-[197px] p-2 md:p-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 rounded-[16px] md:rounded-[21px] flex items-center justify-center bg-[#e2f2da] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[152px] md:h-[155px] m-2 sm:m-3 md:m-[21px]">
                <div className="rounded-full bg-[#6cbe46] flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 pr-3 md:pr-4 min-w-0 py-2">
                <p className="text-lg sm:text-xl md:text-[26px] lg:text-[30px] font-medium leading-[1.2]">
                  Evening Session
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.4] text-gray-800">
                  4:00 PM – 9:00 PM
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-[1.4] text-black/60">
                  Wind down after work
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center w-full max-w-[589px] min-h-[120px] md:min-h-[197px] p-2 md:p-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 rounded-[16px] md:rounded-[21px] flex items-center justify-center bg-[#e2f2da] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[152px] md:h-[155px] m-2 sm:m-3 md:m-[21px]">
                <div className="rounded-full bg-[#6cbe46] flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-6v2m0 16v2m8-10h-2M4 12H2m15.364 6.364l-1.414-1.414M6.343 6.343L4.929 4.929m12.728 0l-1.414 1.414M6.343 17.657l-1.414 1.414"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 pr-3 md:pr-4 min-w-0 py-2">
                <p className="text-lg sm:text-xl md:text-[26px] lg:text-[30px] font-medium leading-[1.2]">
                  Full Day Session
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-[1.4] text-gray-800">
                  6:00 AM – 11:00 PM
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-[1.4] text-black/60">
                  Extended access for members
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-xl leading-[1.35] text-center text-black px-4">
            * Platinum members enjoy extended hours and flexible access
          </p>
        </div>
      </section> */}

      {/* ═══ JOIN US TODAY ═══ */}
      <section className="site-container pt-[30px] md:pt-0 pb-[60px]">
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
                  <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                    full name*
                  </p>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="text"
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
                  <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                    phone number*
                  </p>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email + Age */}
              <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                    email address*
                  </p>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                    age*
                  </p>
                  <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-20">
                    <input
                      type="number"
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
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                  message
                </p>
                <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-start px-5 md:px-6 py-4 md:py-5 min-h-[100px] sm:min-h-[120px] md:min-h-[159px]">
                  <textarea
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
