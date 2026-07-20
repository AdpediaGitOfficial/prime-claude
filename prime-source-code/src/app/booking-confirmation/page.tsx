export const metadata = { title: "Booking Confirmed – Prime Promenade" };

export default function BookingConfirmationPage() {
  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HEADER ═══ */}
      <header className="w-full flex items-center justify-between px-8 lg:px-16 py-6">
        <img src="/images/logo-dark.svg" alt="Prime Promenade" style={{ width: 241, height: 65, objectFit: "contain" }} />
        <button className="rounded-full px-8 py-3 flex items-center gap-3 text-black text-lg font-light cursor-pointer border border-black/20">
          <span>Menu</span>
        </button>
      </header>

      {/* ═══ SUCCESS SECTION ═══ */}
      <section className="py-16 lg:py-20 px-8 flex flex-col items-center text-center">
        {/* Green checkmark icon */}
        <div className="w-[131px] h-[131px] rounded-full bg-green-500 flex items-center justify-center mb-16">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>

        {/* Heading + sub */}
        <div className="flex flex-col gap-10 items-center max-w-[869px]">
          <h1 className="text-5xl lg:text-[76px] font-normal leading-[90px] tracking-[-0.02em] text-black">
            Booking Request Submitted Successfully
          </h1>
          <p className="text-xl leading-[1.3] text-black max-w-[721px]">
            Your booking request has been received. Our team will review the request and confirm availability shortly.
          </p>

          {/* Booking ID badge */}
          <div className="flex items-center justify-center px-4 rounded-[36px]" style={{ background: "#e1ff83", height: "85px", width: "303px" }}>
            <p className="text-xl leading-[1.3] text-black text-center whitespace-nowrap">Booking ID: #BK10245</p>
          </div>
        </div>
      </section>

      {/* ═══ BOOKING DETAILS CARD ═══ */}
      <section className="pb-20 lg:pb-28 px-8 lg:px-16 xl:px-36 flex justify-center">
        <div className="w-full bg-white rounded-[30px] border border-black/40 px-10 lg:px-16 py-10" style={{ maxWidth: "1188px" }}>
          <p className="text-[26px] font-medium leading-[1.3] mb-8">Booking Details</p>

          {/* Details grid: 3 rows x 2 columns */}
          <div className="flex flex-col gap-8">
            {/* Row 1: Service Name | Booking Status */}
            <div className="grid grid-cols-2">
              <div>
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Service Name</p>
                <p className="text-[22px] leading-[1.3]">Swimming Pool</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Booking Status</p>
                <p className="text-[22px] leading-[1.3]" style={{ color: "#ff9000" }}>Pending Admin Approval</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/10"></div>

            {/* Row 2: Booking Date | Time Slot */}
            <div className="grid grid-cols-2">
              <div>
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Booking Date</p>
                <p className="text-[22px] leading-[1.3]">March 18, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Time Slot</p>
                <p className="text-[22px] leading-[1.3]">10:00 AM - 12:00 PM</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black/10"></div>

            {/* Row 3: Customer Name | Contact Number */}
            <div className="grid grid-cols-2">
              <div>
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Customer Name</p>
                <p className="text-[22px] leading-[1.3]">Alex Johnson</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-black/40 leading-[1.3] mb-1">Contact Number</p>
                <p className="text-[22px] leading-[1.3]">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT SECTION (removed) ═══ */}
    </div>
  );
}
