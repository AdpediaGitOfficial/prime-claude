"use client";

import Banner from "../../../public/ASSETS/hall-about.webp";
import { FiSun, FiSunrise } from "react-icons/fi";
import { FiMonitor, FiVolume2, FiMic, FiWifi } from "react-icons/fi";
import { MdOutlineChair } from "react-icons/md";
import { PiStarFourFill } from "react-icons/pi";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";

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
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;

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

  // Generate grid array (null for empty prefix slots, numbers for actual days)
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="bg-white text-black overflow-x-hidden">

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
              src="/ASSETS/regal-about-2.jpeg"
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
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2">LED Projector</p>
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
      </section>

      {/* ═══ BOOKING TIME SLOTS (Section 5 - Odd - Full width background) ═══ */}
      <section className="w-full bg-[#e3e9e8]">
        <div className="site-container py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] text-center mb-3">Booking Time Slots</h2>
          <p className="text-base md:text-xl text-center text-black/70 mb-8 md:mb-12">Choose your preferred time slot for the event</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-8">
            {/* Morning Slot Card */}
            <div
              onClick={() => setSelectedSlot("morning")}
              className={`bg-white rounded-[24px] md:rounded-[30px] p-3 md:p-4 flex items-center gap-4 md:gap-6 w-full max-w-[450px] cursor-pointer transition-all border-2 ${
                selectedSlot === "morning"
                  ? "border-[#00372f] shadow-md"
                  : "border-transparent shadow-sm hover:shadow-md"
              }`}
            >
              <div className="bg-[#e3e9e8] rounded-[16px] md:rounded-[20px] w-[90px] h-[90px] md:w-[120px] md:h-[120px] flex items-center justify-center flex-shrink-0">
                <FiSun className="text-[#00372f] w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 pr-2">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSlot === "morning" ? "border-[#00372f]" : "border-gray-400"}`}>
                    {selectedSlot === "morning" && <div className="w-2.5 h-2.5 bg-[#00372f] rounded-full"></div>}
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-black">Morning Slot</p>
                </div>
                <div className="pl-8">
                  <p className="text-sm md:text-base text-black whitespace-nowrap leading-[1.4]">9:00 AM – 1:00 PM</p>
                  <p className="text-sm md:text-base text-black/60 leading-[1.4]">(4 hours)</p>
                </div>
              </div>
            </div>

            {/* Evening Slot Card */}
            <div
              onClick={() => setSelectedSlot("evening")}
              className={`bg-white rounded-[24px] md:rounded-[30px] p-3 md:p-4 flex items-center gap-4 md:gap-6 w-full max-w-[450px] cursor-pointer transition-all border-2 ${
                selectedSlot === "evening"
                  ? "border-[#00372f] shadow-md"
                  : "border-transparent shadow-sm hover:shadow-md"
              }`}
            >
              <div className="bg-[#e3e9e8] rounded-[16px] md:rounded-[20px] w-[90px] h-[90px] md:w-[120px] md:h-[120px] flex items-center justify-center flex-shrink-0">
                <FiSunrise className="text-[#00372f] w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 pr-2">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSlot === "evening" ? "border-[#00372f]" : "border-gray-400"}`}>
                    {selectedSlot === "evening" && <div className="w-2.5 h-2.5 bg-[#00372f] rounded-full"></div>}
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-black">Evening Slot</p>
                </div>
                <div className="pl-8">
                  <p className="text-sm md:text-base text-black whitespace-nowrap leading-[1.4]">2:00 PM – 6:00 PM</p>
                  <p className="text-sm md:text-base text-black/60 leading-[1.4]">(4 hours)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AVAILABILITY CALENDAR (Section 6 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] text-center mb-3">Availability Calendar</h2>
        <p className="text-base md:text-xl text-center text-black/70 mb-8 md:mb-12">Select your preferred date to check availability</p>

        <div className="max-w-[500px] mx-auto flex flex-col items-center">
          
          {/* Month Nav Pill */}
          <div className="inline-flex items-center justify-center gap-6 md:gap-10 mb-8 md:mb-12 bg-[#e8ecec] rounded-[30px] px-6 py-3 border border-gray-200/50">
            <button onClick={prevMonth} className="text-[#00372f] hover:text-gray-500 transition-colors p-1 active:scale-95">
              <svg className="w-3 h-4" fill="none" viewBox="0 0 8 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 1L1 7l6 6" /></svg>
            </button>
            <span className="text-lg md:text-[22px] font-medium capitalize select-none min-w-[140px] text-center text-black" style={{ fontFamily: "'Euclid Circular A',Poppins,sans-serif" }}>
              {monthName} {year}
            </span>
            <button onClick={nextMonth} className="text-[#00372f] hover:text-gray-500 transition-colors p-1 active:scale-95">
              <svg className="w-3 h-4" fill="none" viewBox="0 0 8 14" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M1 1l6 6-6 6" /></svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="w-full mb-10 md:mb-12 px-4 md:px-0">
            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-center text-sm md:text-[18px] font-medium text-[#909190] py-2 uppercase select-none">{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-3 text-center">
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`}></div>;

                const dateStr = formatCalendarDate(year, month, day);
                const isBooked = bookedDateStrings.includes(dateStr);
                const isSelected = selectedDateStr === dateStr;

                let dayClasses = "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mx-auto text-base sm:text-lg md:text-[20px] transition-all select-none ";

                if (isBooked) {
                  dayClasses += "bg-[#00372f] text-white cursor-not-allowed";
                } else if (isSelected) {
                  dayClasses += "bg-[#6cbd45] text-white font-medium shadow-md cursor-pointer";
                } else {
                  dayClasses += "text-black cursor-pointer hover:bg-gray-100 active:scale-95";
                }

                return (
                  <div key={dateStr} className="flex justify-center items-center">
                    <div
                      onClick={() => {
                        if (!isBooked) setSelectedDateStr(isSelected ? null : dateStr);
                      }}
                      className={dayClasses}
                    >
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend Pill */}
          <div className="flex items-center justify-center w-full bg-[#e8ecec] rounded-full min-h-[60px] md:min-h-[70px] px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:gap-x-[60px]">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#6cbd45] inline-block shadow-sm" />
                <span className="text-sm md:text-[17px] text-black font-medium select-none">Selected</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#00372f] inline-block shadow-sm" />
                <span className="text-sm md:text-[17px] text-black font-medium select-none">Booked</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-black bg-white"></div>
                <span className="text-sm md:text-[17px] text-black font-medium select-none">Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BOOKING ENQUIRY FORM (Section 7 - Odd - Standard Padding) ═══ */}
      <section className="site-container py-12 md:py-16">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">Booking Enquiry Form</h2>
          <p className="text-base md:text-xl text-black/70 mb-8">Fill in your details to submit a booking request</p>
        </div>

        <div className="bg-[#e8ecec] rounded-[24px] md:rounded-[30px] p-6 sm:p-8 lg:p-14 mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Full Name*</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black placeholder-black/40 outline-none w-full" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Phone Number*</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Enter phone number" className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black placeholder-black/40 outline-none w-full" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Email Address*</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black placeholder-black/40 outline-none w-full" />
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Organisation Name*</label>
                <input type="text" name="organisationName" value={formData.organisationName} onChange={handleInputChange} required placeholder="Enter organisation name" className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black placeholder-black/40 outline-none w-full" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Event Type*</label>
                <div className="relative">
                  <select name="eventType" value={formData.eventType} onChange={handleInputChange} required className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black/60 outline-none w-full appearance-none cursor-pointer pr-10">
                    <option value="" disabled>Select event type</option>
                    <option>Corporate Meeting</option>
                    <option>Seminar</option>
                    <option>Workshop</option>
                    <option>Training Session</option>
                    <option>Product Launch</option>
                    <option>Conference</option>
                  </select>
                  <svg className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none w-3 h-4 md:h-5 text-black" viewBox="0 0 13 7" fill="none"><path d="M1 1L6.5 6L12 1" stroke="currentColor" strokeWidth="1.5" /></svg>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Expected Number of Attendance*</label>
                <input type="number" name="attendance" value={formData.attendance} onChange={handleInputChange} required min="1" placeholder="100" className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black placeholder-black/40 outline-none w-full" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Date*</label>
                <div className="relative">
                  <input type="text" value={selectedDateStr ? formatDisplayDate(selectedDateStr) : "Select a date above"} readOnly className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black/60 outline-none w-full appearance-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Time Slot</label>
                <div className="relative">
                  <input type="text" value={selectedSlot ? `${selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)} Slot` : "Select a slot above"} readOnly className="bg-white rounded-[24px] md:rounded-[33px] h-14 md:h-20 px-5 md:px-8 text-base md:text-lg text-black/60 outline-none w-full appearance-none" />
                </div>
              </div>
            </div>

            {/* Row 5 */}
            <div className="flex flex-col gap-2 md:gap-3">
              <label className="capitalize text-base md:text-xl text-black tracking-[-0.02em]">Additional Requirements</label>
              <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 md:px-8 py-4 md:py-6 w-full min-h-[120px] md:min-h-[175px]">
                <textarea name="additionalRequirements" value={formData.additionalRequirements} onChange={handleInputChange} placeholder="Any special requirements and needs" className="bg-transparent text-base md:text-lg text-black/80 placeholder-black/40 outline-none w-full resize-none h-full min-h-[80px] md:min-h-[120px]"></textarea>
              </div>
            </div>



            {/* Dividers + Compliance */}
            <div className="h-px bg-black/20 my-2"></div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} required className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer" />
              <span className="flex flex-col gap-1">
                <span className="text-base md:text-xl text-black capitalize group-hover:text-black/80 transition-colors" style={{ fontFamily: "'Euclid Circular A',Poppins,sans-serif", fontWeight: 500 }}>
                  I agree to the venue booking terms and conditions*
                </span>
                <span className="text-sm md:text-base text-black/70 leading-[1.4]" style={{ fontFamily: "'Euclid Circular A',Poppins,sans-serif" }}>
                  Venue availability is subject to final confirmation by the management team.
                  Any damage, cancellation charges, or additional service costs will be payable as per the booking policy.
                </span>
              </span>
            </label>
            <div className="h-px bg-black/20 my-2"></div>
            <p className="text-sm md:text-lg text-black text-center md:text-left">Booking will be confirmed only after admin approved</p>

            {/* Submit */}
            {(submitMessage || submitError) && (
              <p className={`text-sm md:text-lg text-center md:text-left ${submitError ? "text-red-600" : "text-[#00372f]"}`}>
                {submitError || submitMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="bg-[#00372f] text-white rounded-[24px] md:rounded-[30px] w-full capitalize text-center hover:bg-[#00251f] transition-transform active:scale-95 font-medium h-14 md:h-[70px] text-lg md:text-[24px] mt-2 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? "Sending..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
