"use client";

import PoolTimeSlots, { type Slot } from "@/components/PoolTimeSlots";
import { useState } from "react";
import Image from "next/image";
import { FaStarOfLife, FaCrown } from "react-icons/fa6";
import DatePicker from "@/components/DatePicker";
import { apiCall, ENDPOINTS } from "@/utils/api";

type PlanId = "solo" | "duo" | "session" | "group";

type Plan = {
  id: PlanId;
  name: string;
  caption: string;
  badge: string;
  price: number;
  durationMinutes: number;
  popular?: boolean;
  features: string[];
};

// Rate card — priced per session, jacuzzi & sauna added separately at ₹500 each.
const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    caption: "Just you",
    badge: "1 person",
    price: 500,
    durationMinutes: 60,
    features: ["Ozone, temperature-controlled pool", "Private cabana", "Premium towel service"],
  },
  {
    id: "duo",
    name: "Duo",
    caption: "For two",
    badge: "2 people",
    price: 1000,
    durationMinutes: 60,
    features: ["Ozone, temperature-controlled pool", "Private cabana", "Premium towel service"],
  },
  {
    id: "session",
    name: "Session",
    caption: "Small groups & families",
    badge: "Up to 8 people",
    price: 1500,
    durationMinutes: 90,
    popular: true,
    features: [
      "Ozone, temperature-controlled pool",
      "Private cabanas & towel service",
      "Dedicated speaker system",
      "Kids above 5 years welcome",
    ],
  },
  {
    id: "group",
    name: "Group Function",
    caption: "Parties & celebrations",
    badge: "Up to 12",
    price: 3000,
    durationMinutes: 180,
    features: [
      "Entire pool reserved for your group",
      "Private cabanas & towel service",
      "Dedicated speaker system",
      "Food from Promenade Café on request",
    ],
  },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PoolBookingPage() {
  const [selectedPool, setSelectedPool] = useState<PlanId | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [addons, setAddons] = useState({ sauna: false, jacuzzi: false });
  const [policies, setPolicies] = useState({ dressCode: false, kids: false, terms: false });

  const selectedPlan = PLANS.find((p) => p.id === selectedPool) ?? null;
  const bookingTotal =
    (selectedPlan?.price ?? 0) + (addons.sauna ? 500 : 0) + (addons.jacuzzi ? 500 : 0);

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleConfirmBooking = () => {
    if (!selectedPool) return setMessage("Please select a plan.");
    if (!selectedDate) return setMessage("Please select a date.");
    if (!selectedSlot) return setMessage("Please select a time slot.");
    if (!policies.dressCode || !policies.kids || !policies.terms)
      return setMessage("Please accept all policies and the terms.");
    setMessage(null);
    setShowMobileModal(true);
  };

  const handleSendOtp = async () => {
    if (!guestName.trim()) return setMessage("Please enter your name.");
    if (!/^\d{10}$/.test(mobile)) return setMessage("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      await apiCall(ENDPOINTS.SEND_OTP, { method: "POST", body: JSON.stringify({ phone: "+91" + mobile }) });
      setShowMobileModal(false);
      setShowOtpModal(true);
      setMessage(null);
    } catch (err: any) {
      setMessage(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndBook = async () => {
    if (!otp) return setMessage("Enter the OTP.");
    setLoading(true);
    try {
      const addonsList: string[] = [
        ...(addons.sauna ? ["Sauna Bath"] : []),
        ...(addons.jacuzzi ? ["Jacuzzi"] : []),
      ];
      await apiCall(ENDPOINTS.CREATE_BOOKING, {
        method: "POST",
        body: JSON.stringify({
          guest: guestName.trim(),
          phone: "+91" + mobile,
          otp,
          poolType: selectedPlan ? selectedPlan.name : "",
          date: selectedDate,
          timeSlot: `${selectedSlot!.start} - ${selectedSlot!.end}`,
          addons: addonsList,
          totalAmount: bookingTotal,
        }),
      });
      setShowOtpModal(false);
      setBookingSuccess(true);
      setMessage(null);
    } catch (err: any) {
      setMessage(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:h-screen md:min-h-[600px]">
        <img
          src="/SWIMMING/main-banner.jpg"
          alt="Pool"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47.9%,rgba(0,0,0,0.8) 100%)",
          }}
        ></div>
        <div className="site-container relative h-full flex flex-col items-start md:items-center justify-end !pb-16 md:!pb-20 text-left md:text-center w-full">

          <img src="/Service-logo/final-out-09.png" alt="Hideaway Swimsuites" className="w-[100px] md:w-[120px] object-contain mb-4" />
          <p className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.3] max-w-xl">
            Enjoy temperature control Ozone Activated Indoor Pool.
          </p>
        </div>
      </section>

      <section className="site-container !pt-16 md:!pt-24 lg:!pt-[120px]   text-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] mx-auto items-center">
     
          <div className="relative rounded-[20px] overflow-hidden w-full h-[380px] md:h-[400px] lg:h-[400px]">
            <img
              src="/SWIMMING/main-banner.jpg"
              alt="Hideaway Swimsuite"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

        
          <div className="text-left text-black">
        
      
            <ul className="flex flex-col gap-6 text-base md:text-[25px] lg:text-[25px]">
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>2 exclusive private pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Ozone-based pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Both pools are equipped with sauna &amp; jacuzzi</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Temperature-controlled swimming pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Enjoy music with a dedicated speaker system</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ CHOOSE YOUR PLAN (Alternating Section 1 - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8 lg:mb-10">
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {PLANS.map((plan) => {
            const isSelected = selectedPool === plan.id;
            const hours = Math.floor(plan.durationMinutes / 60);
            const mins = plan.durationMinutes % 60;
            const durationLabel = hours && mins ? `${hours}h ${mins}m` : hours ? `${hours} hour${hours > 1 ? "s" : ""}` : `${mins} min`;
            return (
              <div
                key={plan.id}
                className={`relative rounded-[20px] bg-[#9EF6FD] p-6 md:p-8 flex flex-col gap-4 border-2 transition-colors ${
                  isSelected ? "border-black" : "border-transparent"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    ✓
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold leading-[1.2]">{plan.name}</h3>
                    <p className="text-sm text-black/60 mt-1">{plan.caption}</p>
                  </div>
                  {plan.popular && !isSelected ? (
                    <span className="rounded-[10px] bg-[#e1ff83] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black whitespace-nowrap">
                      Most booked
                    </span>
                  ) : (
                    <span className="rounded-[10px] bg-white px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black whitespace-nowrap">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/75 border border-black/10 px-3 py-1 text-xs font-medium text-black">
                    ⏱ {durationLabel}
                  </span>
                  <span className="rounded-full bg-white/75 border border-black/10 px-3 py-1 text-xs font-medium text-black">
                    {plan.badge}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <FaStarOfLife className="w-3 h-3 flex-shrink-0 mt-1 text-black" />
                      <span className="text-sm font-medium leading-[1.35] text-black">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-1.5 mt-auto">
                  <span className="text-[28px] font-bold leading-none">{inr(plan.price)}</span>
                  <span className="text-sm font-medium text-black/60">/ session</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPool(plan.id);
                    setSelectedSlot(null);
                  }}
                  className="w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-transform active:scale-95 hover:bg-black/85"
                >
                  {isSelected ? "Selected" : `Select ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ SELECT DATE & TIME (Standard Padding) ═══ */}
      <section className="site-container">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8">
          Select Date &amp; Time
        </h2>
        <div className="bg-[#e3fdff] border border-[#77f4ff] rounded-[24px] md:rounded-[30px] px-5 sm:px-8 lg:px-12 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
          {/* Date */}
          <div>
            <p className="text-lg md:text-[20px] capitalize text-black mb-2 md:mb-3">
              Date
            </p>
            <DatePicker onDateChange={setSelectedDate} />
          </div>
          {/* Time Slots */}
          <div>
            <p className="text-lg md:text-[20px] capitalize text-black mb-1 md:mb-2">
              Available Slots
            </p>
            <p className="text-sm text-black/60 mb-3 md:mb-4">
              {selectedPlan
                ? "Only 2 pools are available — a slot may already be booked. We’ll confirm your pool at booking."
                : "Select a plan above to see time slots for its duration."}
            </p>
            <PoolTimeSlots
              durationMinutes={selectedPlan?.durationMinutes ?? 90}
              onSlotChange={setSelectedSlot}
            />
          </div>
        </div>
      </section>

      {/* ═══ ENHANCE YOUR EXPERIENCE (Alternating Section 2 - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8">
          Enhance Your Experience
        </h2>
        <div className="flex flex-col gap-4">
          {/* Row 1: Sauna Bath + Jacuzzi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sauna Bath */}
            <div className="bg-[#e3fdff] rounded-[24px] md:rounded-[30px] flex items-stretch p-3 md:p-4 min-h-[120px] md:min-h-[162px]">
              <div className="bg-white rounded-[14px] flex items-center justify-center flex-shrink-0 w-[90px] md:w-[130px] min-h-[90px] md:min-h-[130px]">
                <img
                  src="/ICONS/Sauna_Bath.png"
                  alt="Sauna"
                  className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pl-4 pr-2 py-1 gap-2 md:gap-3">
                <div>
                  <p className="text-[18px] md:text-[20px] lg:text-[22px] font-medium leading-[1.2] text-black">
                    Sauna Bath
                  </p>
                  <p className="text-[13px] md:text-[15px] capitalize text-black/70 leading-[1.3] mt-1 pr-2">
                    10 Mins
                  </p>
                  <p className="text-[18px] md:text-[20px] font-medium text-black mt-2">
                    &#x20B9; 500
                  </p>
                </div>
                <div className="flex-shrink-0 sm:self-center mt-2 sm:mt-0">
                  <button
                    onClick={() => setAddons((a) => ({ ...a, sauna: !a.sauna }))}
                    className={`text-sm md:text-[18px] font-medium capitalize rounded-full px-5 md:px-6 py-2 md:py-2.5 transition-colors active:scale-95 ${
                      addons.sauna
                        ? "bg-black/20 text-black border border-black/40"
                        : "bg-black text-white hover:bg-black/80"
                    }`}
                  >
                    {addons.sauna ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Jacuzzi */}
            <div className="bg-[#e3fdff] rounded-[24px] md:rounded-[30px] flex items-stretch p-3 md:p-4 min-h-[120px] md:min-h-[162px]">
              <div className="bg-white rounded-[14px] flex items-center justify-center flex-shrink-0 w-[90px] md:w-[130px] min-h-[90px] md:min-h-[130px]">
                <img
                  src="/ICONS/Jacuzzi.png"
                  alt="Jacuzzi"
                  className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pl-4 pr-2 py-1 gap-2 md:gap-3">
                <div>
                  <p className="text-[18px] md:text-[20px] lg:text-[22px] font-medium leading-[1.2] text-black">
                    Jacuzzi
                  </p>
                  <p className="text-[13px] md:text-[15px] capitalize text-black/70 leading-[1.3] mt-1 pr-2">
                    20 Min
                  </p>
                  <p className="text-[18px] md:text-[20px] font-medium text-black mt-2">
                    &#x20B9; 500
                  </p>
                </div>
                <div className="flex-shrink-0 sm:self-center mt-2 sm:mt-0">
                  <button
                    onClick={() => setAddons((a) => ({ ...a, jacuzzi: !a.jacuzzi }))}
                    className={`text-sm md:text-[18px] font-medium capitalize rounded-full px-5 md:px-6 py-2 md:py-2.5 transition-colors active:scale-95 ${
                      addons.jacuzzi
                        ? "bg-black/20 text-black border border-black/40"
                        : "bg-black text-white hover:bg-black/80"
                    }`}
                  >
                    {addons.jacuzzi ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Poolside Dining (full width) */}
          <div className="bg-[#e3fdff] rounded-[24px] md:rounded-[30px] flex items-stretch p-3 md:p-4 min-h-[120px] md:min-h-[162px]">
            <div className="bg-white rounded-[14px] flex items-center justify-center flex-shrink-0 w-[90px] md:w-[130px] min-h-[90px] md:min-h-[130px]">
              <img
                src="/ICONS/Dining.png"
                alt="Dining"
                className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pl-4 pr-2 py-1 gap-2 md:gap-3">
              <div>
                <p className="text-[18px] md:text-[20px] lg:text-[22px] font-medium leading-[1.2] text-black">
                  Poolside Dining
                </p>
                <p className="text-[13px] md:text-[15px] capitalize text-black/70 leading-[1.3] mt-1">
                  Add A Curated Dining Experience
                </p>
              </div>
                <div className="flex-shrink-0 sm:self-center mt-2 sm:mt-0">
                  <button
                    disabled
                    aria-disabled="true"
                    className="bg-black/40 text-white text-sm md:text-[18px] font-medium capitalize rounded-full px-5 md:px-6 py-2 md:py-2.5 cursor-not-allowed opacity-60 transition-colors whitespace-nowrap"
                  >
                    Coming Soon
                  </button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POLICIES & CONFIRMATION (Standard Padding) ═══ */}
      <section className="site-container">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8">
          Policies &amp; Confirmation
        </h2>
        <div className="bg-[#e3fdff] rounded-[24px] md:rounded-[30px] px-5 sm:px-8 lg:px-12 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
          {/* Policy 1: Dress Code */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.dressCode}
              onChange={(e) => setPolicies((p) => ({ ...p, dressCode: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Dress Code Acceptance
              </p>
              <p className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                Appropriate swimwear is required. No denim, shoes, or street
                clothing in pool areas.
              </p>
            </div>
          </label>

          {/* Policy 2: Kids & Supervision Policy */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.kids}
              onChange={(e) => setPolicies((p) => ({ ...p, kids: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Kids & Supervision Policy
              </p>
              <div className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                <p className="mb-1">Children aged 3 to 12 years must be accompanied and supervised by a parent or guardian at all times. The management will not be responsible for any accidents, injuries, or incidents resulting from unsupervised activities.</p>

              </div>
            </div>
          </label>

          {/* Policy 3: Terms & Conditions & Safety Waiver */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.terms}
              onChange={(e) => setPolicies((p) => ({ ...p, terms: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Terms &amp; Conditions &amp; Safety Waiver
              </p>
              <p className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                I have read and agree to the Terms &amp; Conditions and safety waiver of Hideaway Swimsuites below.
              </p>
            </div>
          </label>

          {/* Full terms — scrollable */}
          <div className="max-h-[280px] overflow-y-auto rounded-[16px] bg-white/70 border border-black/10 px-5 py-4">
            <ol className="list-decimal pl-5 flex flex-col gap-3 text-sm md:text-[15px] text-black/80 leading-[1.45]">
              <li><strong className="text-black">Pool Access.</strong> Use is restricted to registered guests, members or authorised users only. Operating hours and booking schedules must be followed.</li>
              <li><strong className="text-black">Private Booking.</strong> The pool is reserved exclusively for you for the booked slot — cancellation, rescheduling or refund is not possible under any circumstances.</li>
              <li><strong className="text-black">Duration &amp; Extra Charges.</strong> An extra ₹500 applies for every additional 10 minutes after your slot ends. Jacuzzi, sauna and other facilities are charged separately.</li>
              <li><strong className="text-black">Health &amp; Safety.</strong> Guests with contagious illness, open wounds, skin infections or epilepsy should not use the pool. Showering before entry is mandatory. No running, diving in shallow areas or rough play.</li>
              <li><strong className="text-black">Children &amp; Supervision.</strong> Under-12s must be supervised by an adult at all times. Children below 3 years are not allowed. Parents/guardians are fully responsible for minors.</li>
              <li><strong className="text-black">Swimming Ability &amp; Emergencies.</strong> For group/family bookings, at least one adult must be able to swim and perform CPR. Life jackets are advised for non-swimmers and children.</li>
              <li><strong className="text-black">Proper Swimwear.</strong> Proper attire required; cotton clothing, jeans or unsuitable attire are not allowed.</li>
              <li><strong className="text-black">Hygiene.</strong> Shower before entry. Ladies during menstruation are requested not to use the pool. No spitting, urinating or contaminating the water. Pets not allowed unless permitted.</li>
              <li><strong className="text-black">Food &amp; Beverages.</strong> No glass bottles, alcohol or outside food. Food may be ordered from Promenade Café. Dispose of waste properly.</li>
              <li><strong className="text-black">Use at Own Risk.</strong> This is a private facility used at your own risk. Management is not responsible for accidents, injuries, drowning, or loss/damage of belongings.</li>
              <li><strong className="text-black">Emergencies.</strong> Press the emergency button and call 100/101, or proceed to Amala Hospital.</li>
              <li><strong className="text-black">Damage &amp; Liability.</strong> Damage to pool property or equipment is charged to the responsible guest. Staff may enter the pool area when necessary.</li>
              <li><strong className="text-black">Weather &amp; Maintenance.</strong> Management may temporarily close the pool for maintenance or safety without prior notice.</li>
              <li><strong className="text-black">Noise &amp; Conduct.</strong> No loud music, abusive language or disruptive conduct. Maximum liability for any dispute is limited to 70% of the amount paid. Management is not responsible for loss/theft of belongings.</li>
              <li><strong className="text-black">Right to Refuse Access.</strong> Management may deny entry or remove anyone violating the rules.</li>
              <li><strong className="text-black">Agreement.</strong> By booking you confirm that you have read, understood and agree to these Terms &amp; Conditions and the safety waiver.</li>
            </ol>
          </div>
        </div>

        {message && !showMobileModal && !showOtpModal && (
          <p className="text-center text-rose-600 mt-4 text-sm">{message}</p>
        )}
        {bookingSuccess && (
          <p className="text-center text-green-600 font-medium mt-4">Booking confirmed! We’ll see you at the pool.</p>
        )}

        {/* Running total */}
        {selectedPlan && (
          <div className="mt-8 flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-black/60">Total</span>
              <span className="text-3xl font-bold text-black">{inr(bookingTotal)}</span>
            </div>
            <p className="text-xs text-black/55">
              {selectedPlan.name}
              {addons.jacuzzi ? " · Jacuzzi ₹500" : ""}
              {addons.sauna ? " · Sauna ₹500" : ""}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-6 md:mt-8">
          <button
            onClick={handleConfirmBooking}
            className="bg-black text-white text-lg md:text-[22px] font-medium capitalize rounded-full px-10 md:px-16 py-4 md:py-5 hover:bg-black/80 transition-transform active:scale-95 w-full sm:w-auto"
          >
            Confirm Booking
          </button>
        </div>
      </section>

      {/* ═══ A SANCTUARY OF SERENITY (Alternating Section 3 - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
      
          <h2 className="text-3xl md:text-4xl lg:text-[60px] font-normal leading-[1.2]">
            A Sanctuary of Serenity
          </h2>
        </div>
        {/* Gallery Row 1: large left + smaller right */}
        <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[260px] md:h-[350px] lg:h-[484px]">
            <Image
              src="/SWIMMING/swimming_gallery_1.webp"
              alt="Gallery 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[260px] md:h-[350px] lg:h-[484px]">
            <Image
              src="/SWIMMING/swimming_gallery_2.webp"
              alt="Gallery 2"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Gallery Row 2: 4 equal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_3.webp"
              alt="Gallery 3"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_4.webp"
              alt="Gallery 4"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_5.webp"
              alt="Gallery 5"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_6.webp"
              alt="Gallery 6"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>

      {/* ═══ MOBILE MODAL ═══ */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-[360px] shadow-2xl">
            <h3 className="text-xl font-semibold mb-1">Enter your details</h3>
            <p className="text-sm text-black/50 mb-5">We'll send a one-time OTP to verify your identity.</p>
            <input
              type="text"
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name"
            />
            <input
              type="tel"
              maxLength={10}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Mobile number (e.g. 9876543210)"
            />
            {message && <p className="text-rose-600 text-sm mb-3">{message}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowMobileModal(false); setMessage(null); }}
                className="flex-1 border border-black/20 rounded-full py-3 text-sm font-medium hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OTP MODAL ═══ */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-[360px] shadow-2xl">
            <h3 className="text-xl font-semibold mb-1">Enter OTP</h3>
            <p className="text-sm text-black/50 mb-3">OTP sent to:</p>
            <div className="flex items-center justify-between bg-black/5 rounded-xl px-4 py-3 mb-5">
              <span className="text-base font-medium tracking-wide">+91 {mobile}</span>
              <button
                onClick={() => { setShowOtpModal(false); setOtp(""); setMessage(null); setShowMobileModal(true); }}
                className="text-xs text-black/50 underline hover:text-black transition-colors ml-3"
              >
                Change
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base tracking-[0.3em] text-center mb-4 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
            />
            {message && <p className="text-rose-600 text-sm mb-3">{message}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowOtpModal(false); setMessage(null); }}
                className="flex-1 border border-black/20 rounded-full py-3 text-sm font-medium hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtpAndBook}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-60"
              >
                {loading ? "Booking…" : "Verify & Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
