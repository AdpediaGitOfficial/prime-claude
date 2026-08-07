"use client";

import Banner from "../../../public/ASSETS/regal.jpg";
import { FiSun, FiSunrise } from "react-icons/fi";
import { FiMonitor, FiVolume2, FiMic, FiWifi } from "react-icons/fi";
import { MdOutlineChair } from "react-icons/md";
import { PiStarFourFill } from "react-icons/pi";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import { sanitizeName, sanitizePhone, isValidName, isValidPhone, NAME_ERROR, PHONE_ERROR } from "@/utils/validation";

type HallBookingForm = {
  fullName: string;
  phone: string;
  email: string;
  organisationName: string;
  eventType: string;
  attendance: string;
  additionalRequirements: string;
  termsAccepted: boolean;
};

const initialFormData: HallBookingForm = {
  fullName: "",
  phone: "",
  email: "",
  organisationName: "",
  eventType: "",
  attendance: "",
  additionalRequirements: "",
  termsAccepted: false,
};

const formatCalendarDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const formatDisplayDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

export default function ConferencePage() {
  // --- Booking Slot State ---
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<HallBookingForm>(initialFormData);
  const [bookedDateStrings, setBookedDateStrings] = useState<string[]>([]);
  const { isSubmitting, submitMessage, submitError, setSubmitMessage, setSubmitError, runSubmit } =
    useFormSubmit();

  // --- Calendar State & Logic ---
  // Default to the first day of the current month so the calendar never goes stale.
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiCall(ENDPOINTS.HALL_BOOKINGS)
      .then((bookings) => {
        if (!isMounted || !Array.isArray(bookings)) return;

        const bookedDates = bookings
          .map((booking) => (typeof booking?.date === "string" ? booking.date.slice(0, 10) : ""))
          .filter(Boolean);

        setBookedDateStrings(Array.from(new Set(bookedDates)));
      })
      .catch((error) => {
        console.error("Failed to load hall bookings", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const nextValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : name === "fullName"
        ? sanitizeName(value)
        : name === "phone"
        ? sanitizePhone(value)
        : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!selectedDateStr) {
      setSubmitError("Please select a booking date.");
      return;
    }

    if (!selectedSlot) {
      setSubmitError("Please select a time slot.");
      return;
    }
    if (!isValidName(formData.fullName)) {
      setSubmitError(NAME_ERROR);
      return;
    }
    if (!isValidPhone(formData.phone)) {
      setSubmitError(PHONE_ERROR);
      return;
    }

    const payload = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      organisationName: formData.organisationName,
      eventType: formData.eventType,
      attendance: Number(formData.attendance),
      date: selectedDateStr,
      timeSlot: `${selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)} Slot`,
      additionalRequirements: formData.additionalRequirements,
      termsAccepted: formData.termsAccepted,
    };

    runSubmit(
      async () => {
        const createdBooking = await apiCall(ENDPOINTS.HALL_BOOKINGS, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setBookedDateStrings((current) => Array.from(new Set([...current, createdBooking?.date?.slice(0, 10) || selectedDateStr])));
        setFormData(initialFormData);
        setSelectedDateStr(null);
        setSelectedSlot(null);
        return createdBooking?.reference
          ? `Booking request sent successfully. Your booking ID: ${createdBooking.reference}`
          : undefined;
      },
      "Booking request sent successfully.",
      "Failed to send booking request."
    );
  };

  // Calendar Helpers
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const slotLabel = (slot: string | null) =>
    slot === "morning" ? "Morning · 9 AM – 1 PM" : slot === "evening" ? "Evening · 2 – 6 PM" : null;

  // Generate grid array (null for empty prefix slots, numbers for actual days)
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="bg-white text-black overflow-x-clip">

      {/* ═══ HERO (Section 1 - Odd) ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:h-screen">
        <img
          src={Banner.src}
          alt="Conference Hall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 48%,rgba(0,0,0,0.9) 100%)" }}
        ></div>
        
        <div className="site-container relative h-full flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full">
          <img
            src="/Service-logo/final-out-06.png"
            alt="Conference"
            className="mx-auto w-[140px] md:w-[200px] lg:w-[260px] object-contain mb-6"
          />

  
          <p className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[830px] px-2 sm:px-0">
            An event space ideal for corporate meetings, celebrations and gatherings.
          </p>
        </div>
      </section>

      {/* ═══ HALL OVERVIEW (Section 2 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="rounded-[20px] lg:rounded-[26px] overflow-hidden h-[300px] sm:h-[400px] lg:h-[554px]">
            <img
              src="/ASSETS/regal-2.jpg"
              alt="Conference Hall Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">Multi-purpose Hall Overview</h2>
            <p className="text-base sm:text-lg md:text-xl leading-[1.35] text-black/80">
              Regal at the Promenade is a refined multi-purpose hall within Prime Promenade, designed to host up to 100 guests with ease. Whether it’s board meetings, corporate discussions, family gatherings, or intimate celebrations, the space adapts seamlessly to both professional and personal occasions.<br></br><br></br>
              Equipped with modern multimedia facilities and essential infrastructure, Regal offers a well-appointed indoor setting that ensures comfort, functionality, and a smooth event experience from start to finish.
            </p>
            <ul className="flex flex-col gap-4 md:gap-6">
  <li className="flex items-start md:items-center gap-4 md:gap-6 text-base md:text-xl text-black">
    <span className="inline-flex items-center justify-center w-7 h-7 md:w-[33px] md:h-[33px] flex-shrink-0 mt-1 md:mt-0">
      <PiStarFourFill className="w-5 h-5 text-forest md:w-6 md:h-6" />
    </span>
    Spacious seating arrangement for up to 100 people
  </li>
  <li className="flex items-start md:items-center gap-4 md:gap-6 text-base md:text-xl text-black">
    <span className="inline-flex items-center justify-center w-7 h-7 md:w-[33px] md:h-[33px] flex-shrink-0 mt-1 md:mt-0">
      <PiStarFourFill className="w-5 h-5 text-forest md:w-6 md:h-6" />
    </span>
    Ideal for seminars, corporate meetings, workshops, and training sessions
  </li>
  <li className="flex items-start md:items-center gap-4 md:gap-6 text-base md:text-xl text-black">
    <span className="inline-flex items-center justify-center w-7 h-7 md:w-[33px] md:h-[33px] flex-shrink-0 mt-1 md:mt-0">
      <PiStarFourFill className="w-5 h-5 text-forest md:w-6 md:h-6" />
    </span>
    Elegant interior with professional ambience
  </li>

</ul>
          </div>
        </div>
      </section>

      {/* ═══ SEATING LAYOUT & GALLERY (Section 3 - Odd - Standard Padding) ═══ */}
      <section className="site-container py-12 md:py-16">
  <div className="bg-[rgba(0,55,47,0.15)] rounded-[24px] md:rounded-[30px] p-4 sm:p-8 lg:p-14">
    <h2 className="text-2xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] text-center mb-3">
      Seating Layout &amp; Gallery
    </h2>
    <p className="text-sm md:text-xl text-center text-black/70 mb-6 md:mb-12">
      Explore our versatile conference hall through various setups and configurations
    </p>

    {/* Responsive wrapper: 1-col mobile, 2-col tablet, 3-col custom desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[367fr_794fr_367fr] gap-3 md:gap-5">
      
      {/* Col 1 */}
      <div className="flex flex-col gap-3 md:gap-5">
        <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[279px]">
          <img src="/ASSETS/hall-portfolio-6.webp" alt="Seating arrangement" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[488px]">
          <img src="/ASSETS/hall-portfolio-5.webp" alt="Conference setup" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Col 2 - Brought to top on tablet, spans 2 columns */}
      <div className="flex flex-col gap-3 md:gap-5 md:col-span-2 lg:col-span-1 md:order-first lg:order-none">
        <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-video lg:aspect-auto lg:h-[488px]">
          <img src="/ASSETS/hall-portfolio-4.webp" alt="Event hall" className="w-full h-full object-cover" />
        </div>
        {/* Nested Grid: Forced to 2 columns even on mobile to save vertical space */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:h-[279px] lg:grid-cols-[382fr_392fr]">
          <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-square lg:aspect-auto h-full">
            <img src="/ASSETS/hall-portfolio-3.webp" alt="Meeting room" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-square lg:aspect-auto h-full">
            <img src="/ASSETS/regal-6.jpeg" alt="Training room" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Col 3 */}
      <div className="flex flex-col gap-3 md:gap-5">
        <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[488px]">
          <img src="/ASSETS/regal-7.jpeg" alt="Seminar room" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-[16px] md:rounded-[20px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[279px]">
          <img src="/ASSETS/hall-portfolio-7.webp" alt="Workshop space" className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  </div>
</section>

      {/* ═══ AMENITIES & MULTIMEDIA SETUP (Section 4 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">Amenities &amp; Multimedia Setup</h2>
          <p className="text-base md:text-xl text-black/70 max-w-sm">World-class facilities designed to ensure your event runs smoothly</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          <div className="bg-[#d9e1e0] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between min-h-[250px] md:min-h-[369px]">
            <FiMonitor className="text-[#00372f] w-10 h-10 md:w-12 md:h-12 mb-6" strokeWidth={1.5} />
            <div>
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">LED Projector<sup className="text-[#00372f] font-semibold ml-0.5">*</sup></p>
              <p className="text-base md:text-xl text-black/70 leading-[1.35]">High-definition presentation screens</p>
            </div>
          </div>
          <div className="bg-[#d9e1e0] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between min-h-[250px] md:min-h-[369px]">
            <FiVolume2 className="text-[#00372f] w-10 h-10 md:w-12 md:h-12 mb-6" strokeWidth={1.5} />
            <div>
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">Sound System</p>
              <p className="text-base md:text-xl text-black/70 leading-[1.35]">Professional audio setup for perfect acoustics</p>
            </div>
          </div>
          <div className="bg-[#d9e1e0] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between min-h-[250px] md:min-h-[369px]">
            <FiMic className="text-[#00372f] w-10 h-10 md:w-12 md:h-12 mb-6" strokeWidth={1.5} />
            <div>
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">Wireless Microphones</p>
              <p className="text-base md:text-xl text-black/70 leading-[1.35]">Multiple wireless mics for seamless presentations</p>
            </div>
          </div>
          <div className="bg-[#d9e1e0] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between min-h-[250px] md:min-h-[369px]">
            <FiWifi className="text-[#00372f] w-10 h-10 md:w-12 md:h-12 mb-6" strokeWidth={1.5} />
            <div>
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">High-Speed Internet</p>
              <p className="text-base md:text-xl text-black/70 leading-[1.35]">Reliable WiFi connectivity throughout the venue</p>
            </div>
          </div>
          <div className="bg-[#d9e1e0] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col justify-between min-h-[250px] md:min-h-[369px]">
            <MdOutlineChair className="text-[#00372f] w-10 h-10 md:w-12 md:h-12 mb-6" />
            <div>
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">Comfortable Seating</p>
              <p className="text-base md:text-xl text-black/70 leading-[1.35]">Ergonomic chairs for extended sessions</p>
            </div>
          </div>
        </div>
        <p className="text-sm md:text-base text-black/50 mt-6 md:mt-8">* Subject to extra cost</p>
      </section>

      {/* ═══ BOOK THE HALL (unified booking) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3">Book the Hall</h2>
          <p className="text-base md:text-xl text-black/70 max-w-2xl mx-auto">
            Pick a date and slot, add your event details, and send a request — the team confirms availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          {/* LEFT: steps */}
          <div className="flex flex-col gap-6">
            {/* Step 1 — date & slot */}
            <div className="bg-white border border-black/10 rounded-[24px] md:rounded-[30px] p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex-none w-7 h-7 rounded-full bg-[#00372f] text-white text-sm font-bold flex items-center justify-center">1</span>
                <h3 className="text-xl md:text-2xl font-medium">Choose date &amp; time slot</h3>
              </div>
              <p className="text-sm text-black/60 mb-6 pl-10">Grey struck-through dates are already booked; faint dates are in the past.</p>

              {/* Calendar */}
              <div className="max-w-[440px] mx-auto flex flex-col items-center">
                <div className="inline-flex items-center justify-center gap-6 md:gap-10 mb-6 bg-[#e8ecec] rounded-[30px] px-6 py-3 border border-gray-200/50">
                  <button type="button" aria-label="Previous month" onClick={prevMonth} className="text-[#00372f] hover:text-gray-500 transition-colors p-1 active:scale-95">
                    <svg className="w-3 h-4" fill="none" viewBox="0 0 8 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 1L1 7l6 6" /></svg>
                  </button>
                  <span className="text-lg md:text-[22px] font-medium capitalize select-none min-w-[150px] text-center text-black">
                    {monthName} {year}
                  </span>
                  <button type="button" aria-label="Next month" onClick={nextMonth} className="text-[#00372f] hover:text-gray-500 transition-colors p-1 active:scale-95">
                    <svg className="w-3 h-4" fill="none" viewBox="0 0 8 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6-6 6" /></svg>
                  </button>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-7 mb-3">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="text-center text-xs md:text-sm font-medium text-[#909190] py-1 uppercase select-none">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-center">
                    {calendarDays.map((day, index) => {
                      if (!day) return <div key={`empty-${index}`}></div>;

                      const dateStr = formatCalendarDate(year, month, day);
                      const cellDate = new Date(year, month, day);
                      const isPast = cellDate < todayStart;
                      const isBooked = !isPast && bookedDateStrings.includes(dateStr);
                      const isSelected = selectedDateStr === dateStr;
                      const disabled = isPast || isBooked;

                      let dayClasses = "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mx-auto text-base sm:text-lg md:text-[19px] transition-all select-none ";
                      if (isSelected) dayClasses += "bg-[#6cbd45] text-white font-medium shadow-md cursor-pointer active:scale-95";
                      else if (isPast) dayClasses += "text-black/30 cursor-not-allowed";
                      else if (isBooked) dayClasses += "bg-[#d9e1e0] text-black/50 line-through cursor-not-allowed";
                      else dayClasses += "text-black cursor-pointer hover:bg-[#e3e9e8] active:scale-95";

                      return (
                        <div key={dateStr} className="flex justify-center items-center">
                          <button
                            type="button"
                            disabled={disabled}
                            aria-pressed={isSelected}
                            aria-label={`${day} ${monthName} ${year}${isBooked ? " — already booked" : ""}`}
                            onClick={() => { if (!disabled) setSelectedDateStr(isSelected ? null : dateStr); }}
                            className={dayClasses}
                          >
                            {day}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 mt-6 text-sm">
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-white border-[1.5px] border-[#00372f] inline-block" /><span className="text-black/70 select-none">Available</span></div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#6cbd45] inline-block" /><span className="text-black/70 select-none">Selected</span></div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#d9e1e0] inline-block" /><span className="text-black/70 select-none">Booked</span></div>
                </div>
              </div>

              {/* Slots */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setSelectedSlot("morning")}
                  aria-pressed={selectedSlot === "morning"}
                  className={`bg-white rounded-[20px] p-3 md:p-4 flex items-center gap-4 text-left cursor-pointer transition-all border-2 ${selectedSlot === "morning" ? "border-[#00372f] shadow-md" : "border-black/10 hover:shadow-sm"}`}
                >
                  <div className="bg-[#e3e9e8] rounded-[16px] w-[60px] h-[60px] flex items-center justify-center flex-shrink-0">
                    <FiSun className="text-[#00372f] w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedSlot === "morning" ? "border-[#00372f]" : "border-gray-400"}`}>
                        {selectedSlot === "morning" && <span className="w-2.5 h-2.5 bg-[#00372f] rounded-full" />}
                      </span>
                      <span className="text-lg font-medium text-black">Morning Slot</span>
                    </div>
                    <span className="text-sm text-black/60 pl-[30px]">9:00 AM – 1:00 PM · 4 hours</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSlot("evening")}
                  aria-pressed={selectedSlot === "evening"}
                  className={`bg-white rounded-[20px] p-3 md:p-4 flex items-center gap-4 text-left cursor-pointer transition-all border-2 ${selectedSlot === "evening" ? "border-[#00372f] shadow-md" : "border-black/10 hover:shadow-sm"}`}
                >
                  <div className="bg-[#e3e9e8] rounded-[16px] w-[60px] h-[60px] flex items-center justify-center flex-shrink-0">
                    <FiSunrise className="text-[#00372f] w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedSlot === "evening" ? "border-[#00372f]" : "border-gray-400"}`}>
                        {selectedSlot === "evening" && <span className="w-2.5 h-2.5 bg-[#00372f] rounded-full" />}
                      </span>
                      <span className="text-lg font-medium text-black">Evening Slot</span>
                    </div>
                    <span className="text-sm text-black/60 pl-[30px]">2:00 PM – 6:00 PM · 4 hours</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2 — event details */}
            <div className="bg-white border border-black/10 rounded-[24px] md:rounded-[30px] p-5 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <span className="flex-none w-7 h-7 rounded-full bg-[#00372f] text-white text-sm font-bold flex items-center justify-center">2</span>
                <h3 className="text-xl md:text-2xl font-medium">Event details</h3>
              </div>
              <p className="text-sm text-black/60 mb-6 pl-10">Tell us who&apos;s booking and what you&apos;re planning.</p>

              <div className="bg-[#e8ecec] rounded-[24px] p-5 sm:p-8">
                <form id="hall-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-fullName" className="text-sm md:text-base text-black">Full Name*</label>
                      <input id="hall-fullName" type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-phone" className="text-sm md:text-base text-black">Phone Number*</label>
                      <input id="hall-phone" type="tel" name="phone" inputMode="numeric" maxLength={10} value={formData.phone} onChange={handleInputChange} required placeholder="Enter phone number" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-email" className="text-sm md:text-base text-black">Email Address</label>
                      <input id="hall-email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com (optional)" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-org" className="text-sm md:text-base text-black">Organisation Name*</label>
                      <input id="hall-org" type="text" name="organisationName" value={formData.organisationName} onChange={handleInputChange} required placeholder="Enter organisation name" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-eventType" className="text-sm md:text-base text-black">Event Type*</label>
                      <div className="relative">
                        <select id="hall-eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} required className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black/80 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full appearance-none cursor-pointer pr-10">
                          <option value="" disabled>Select event type</option>
                          <option>Corporate Meeting</option>
                          <option>Seminar</option>
                          <option>Workshop</option>
                          <option>Training Session</option>
                          <option>Product Launch</option>
                          <option>Conference</option>
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-4 text-black" viewBox="0 0 13 7" fill="none"><path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="1.5" /></svg>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="hall-attendance" className="text-sm md:text-base text-black">Expected Attendance*</label>
                      <input id="hall-attendance" type="number" name="attendance" value={formData.attendance} onChange={handleInputChange} required min="1" max="100" placeholder="e.g. 80" className="bg-white rounded-[14px] h-12 md:h-14 px-4 text-base text-black placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="hall-req" className="text-sm md:text-base text-black">Additional Requirements</label>
                    <textarea id="hall-req" name="additionalRequirements" value={formData.additionalRequirements} onChange={handleInputChange} placeholder="Any special requirements (catering, stage setup, AV needs…)" className="bg-white rounded-[14px] px-4 py-3 text-base text-black/80 placeholder-black/40 outline-none focus:ring-2 focus:ring-[#00372f]/20 w-full resize-y min-h-[110px]" />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-black/10 mt-1">
                    <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} required className="w-5 h-5 flex-shrink-0 mt-1 rounded border-gray-400 accent-[#00372f] cursor-pointer" />
                    <span className="flex flex-col gap-1">
                      <span className="text-base text-black font-medium">I agree to the venue booking terms and conditions*</span>
                      <span className="text-sm text-black/70 leading-[1.4]">
                        Venue availability is subject to final confirmation by the management team. Any damage, cancellation charges, or additional service costs are payable as per the booking policy.
                      </span>
                    </span>
                  </label>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT: sticky summary */}
          <aside className="lg:sticky lg:top-24 bg-white border border-black/10 rounded-[24px] overflow-hidden shadow-md">
            <div className="bg-[#00372f] text-white px-6 py-5">
              <p className="text-lg font-medium">Booking request</p>
              <p className="text-sm text-white/70 mt-0.5">Regal at the Promenade · up to 100 guests</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-black/60">Date</span>
                <span className={`font-medium text-right ${selectedDateStr ? "text-black" : "text-black/50 font-normal"}`}>{selectedDateStr ? formatDisplayDate(selectedDateStr) : "Not selected"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-black/60">Time slot</span>
                <span className={`font-medium text-right ${selectedSlot ? "text-black" : "text-black/50 font-normal"}`}>{slotLabel(selectedSlot) ?? "Not selected"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-black/60">Event type</span>
                <span className={`font-medium text-right ${formData.eventType ? "text-black" : "text-black/50 font-normal"}`}>{formData.eventType || "—"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-black/60">Attendance</span>
                <span className={`font-medium text-right ${formData.attendance ? "text-black" : "text-black/50 font-normal"}`}>{formData.attendance ? `${formData.attendance} guests` : "—"}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-black/60">Organiser</span>
                <span className={`font-medium text-right ${formData.organisationName ? "text-black" : "text-black/50 font-normal"}`}>{formData.organisationName || "—"}</span>
              </div>
            </div>
            <div className="px-6 pb-4">
              {(submitMessage || submitError) && (
                <p className={`mb-3 text-sm ${submitError ? "text-red-600" : "text-[#00372f]"}`}>{submitError || submitMessage}</p>
              )}
              <button type="submit" form="hall-form" disabled={isSubmitting} className="w-full bg-[#00372f] text-white rounded-[16px] py-4 font-medium hover:bg-[#00251f] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? "Sending…" : "Send Booking Request"}
              </button>
              <p className="mt-3 text-xs text-black/55 flex gap-2 items-start">
                <span className="text-[#00372f]">ⓘ</span>
                Booking is confirmed only after admin approval. No payment is taken online.
              </p>
            </div>
          </aside>
        </div>
      </section>

    </div>
  );
}
