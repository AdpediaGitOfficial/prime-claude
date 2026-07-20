import Banner from "../../../public/ASSETS/vendor-main-banner.webp";
import Icon1 from "../../../public/ICONS/icon-1.png";
import Icon2 from "../../../public/ICONS/icon-2.png";
import Icon3 from "../../../public/ICONS/icon-3.png";
import { MotionDiv } from "@/components/MotionWrappers";
import VendorCounters from "@/components/VendorCounters";

export const metadata = { title: "Multi-Brand Vendor Zone – Prime Promenade" };

export default function VendorPage() {
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
            <img src="/Service-logo/final-out-07.png" alt="Oxy Gym" className="mx-auto w-[160px] md:w-[220px] object-contain" />
          </MotionDiv>
          <p className="text-base sm:text-lg md:text-xl leading-[1.3] text-white/90 max-w-[821px] px-2 sm:px-0">
            A floor featuring a space for brands and vendors to showcase their products. Join our marketplace to reach new customers.
          </p>
        </div>
      </section>

      {/* ═══ ABOUT THE VENDOR ZONE (Section 2 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] text-center mb-4 md:mb-6">
          About the Vendor Zone
        </h2>
        <p className="text-base sm:text-lg md:text-xl leading-[1.35] text-center max-w-[1067px] mx-auto mb-10 md:mb-16 text-black/80">
          Our vendor zone provides retail counters for multiple brands, creating
          a dynamic shopping environment where businesses can promote their
          products and reach new customers. Whether you&apos;re an established
          brand or an emerging entrepreneur, we offer the perfect platform to
          showcase your offerings.
        </p>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Retail Counters */}
          <div
            className="rounded-[24px] md:rounded-[30px] p-6 sm:p-8 pt-8 md:pt-10 flex flex-col gap-6 h-[430px]"
            style={{ background: "rgba(236,104,36,0.1)" }}
          >
            <img
              src={Icon3.src}
              alt="Grow Your Business"
              className="w-[50px] md:w-[60px] h-auto self-start"
            />
            <div className="mt-auto pt-6 md:pt-10">
              <p className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-3 md:mb-4">
                Retail Counters
              </p>
              <p className="text-base md:text-xl leading-[1.35] text-black/80">
                Premium retail counter space designed for product showcase and
                sales
              </p>
            </div>
          </div>

          {/* High Foot Traffic */}
          <div
            className="rounded-[24px] md:rounded-[30px] p-6 sm:p-8 pt-8 md:pt-10 flex flex-col gap-6 h-[430px]"
            style={{ background: "rgba(236,104,36,0.1)" }}
          >
            <img
              src={Icon1.src}
              alt="Retail Counters"
              className="w-[50px] md:w-[60px] h-auto self-start"
            />

            <div className="mt-auto pt-6 md:pt-10">
              <p className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-3 md:mb-4">
                High Foot Traffic
              </p>
              <p className="text-base md:text-xl leading-[1.35] text-black/80">
                Access to a diverse customer base in a strategic first-floor
                location
              </p>
            </div>
          </div>

          {/* Grow Your Business */}
          <div
            className="rounded-[24px] md:rounded-[30px] p-6 sm:p-8 pt-8 md:pt-10 flex flex-col gap-6 h-[430px]"
            style={{ background: "rgba(236,104,36,0.1)" }}
          >
            <img
              src={Icon2.src}
              alt="High Foot Traffic"
              className="w-[50px] md:w-[60px] h-auto self-start"
            />

            <div className="mt-auto pt-6 md:pt-10">
              <p className="text-2xl md:text-[30px] font-medium leading-[1.2] mb-3 md:mb-4">
                Grow Your Business
              </p>
              <p className="text-base md:text-xl leading-[1.35] text-black/80">
                Flexible terms to help your brand scale and reach new markets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AVAILABLE VENDOR COUNTERS (Section 3 - Odd - Standard Padding) ═══ */}
      <section className="site-container">
        <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] text-center mb-3 md:mb-4">
          Available Vendor Counters
        </h2>
        <p className="text-base sm:text-lg md:text-xl leading-[1.35] text-center mb-8 md:mb-12 text-black/80">
          Choose from our selection of strategically located retail counters
        </p>

        <VendorCounters />

      </section>

      {/* ═══ FLEXIBLE BOOKING OPTIONS (Section 4 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] text-center mb-3 md:mb-4">
          Flexible Booking Options
        </h2>
        <p className="text-base md:text-xl leading-[1.35] text-center mb-8 md:mb-12 text-black/80">
          Choose the rental duration that best suits your business needs
        </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
  {/* 1 Day */}
  <div
    className="rounded-[24px] md:rounded-[30px] flex items-center justify-center h-[420px] px-6 py-10 md:p-10"
    style={{ background: "#fdf0e9" }}
  >
    {/* Inner Content Container */}
    <div className="flex flex-col items-center w-full gap-8 md:gap-10">
      <div className="flex flex-col items-center gap-3">
        <p className="text-2xl md:text-[26px] font-semibold leading-[1.35] text-center text-black">
          1 Week
        </p>
        <p className="text-base md:text-lg font-medium leading-[1.35] text-center text-black">
          Ideal for product launches or short promotions
        </p>
      </div>
      <div className="bg-white rounded-[20px] md:rounded-[24px] w-full py-6 px-4 flex justify-center">
        <ul className="list-disc text-[15px] md:text-base leading-[1.35] text-left space-y-2 w-fit pl-5 text-black">
          <li>Quick setup</li>
          <li>Event-based selling</li>
          <li>Flexible timing</li>
        </ul>
      </div>
    </div>
  </div>

  {/* 1 Week */}
  <div
    className="rounded-[24px] md:rounded-[30px] flex items-center justify-center h-[420px] px-6 py-10 md:p-10"
    style={{ background: "#fdf0e9" }}
  >
    {/* Inner Content Container */}
    <div className="flex flex-col items-center w-full gap-8 md:gap-10">
      <div className="flex flex-col items-center gap-3">
        <p className="text-2xl md:text-[26px] font-semibold leading-[1.35] text-center text-black">
          1 Month
        </p>
        <p className="text-base md:text-lg font-medium leading-[1.35] text-center text-black">
          Suitable for seasonal sales or campaigns
        </p>
      </div>
      <div className="bg-white rounded-[20px] md:rounded-[24px] w-full py-6 px-4 flex justify-center">
        <ul className="list-disc text-[15px] md:text-base leading-[1.35] text-left space-y-2 w-fit pl-5 text-black">
          <li>Monthly rotations</li>
          <li>Campaign flexibility</li>
          <li>Market testing</li>
        </ul>
      </div>
    </div>
  </div>

  {/* 1 Year */}
  <div
    className="rounded-[24px] md:rounded-[30px] flex items-center justify-center h-[420px] px-6 py-10 md:p-10"
    style={{ background: "#fdf0e9" }}
  >
    {/* Inner Content Container */}
    <div className="flex flex-col items-center w-full gap-8 md:gap-10">
      <div className="flex flex-col items-center gap-3">
        <p className="text-2xl md:text-[26px] font-semibold leading-[1.35] text-center text-black">
          1 Year
        </p>
        <p className="text-base md:text-lg font-medium leading-[1.35] text-center text-black">
          Long-term retail presence for brands
        </p>
      </div>
      <div className="bg-white rounded-[20px] md:rounded-[24px] w-full py-6 px-4 flex justify-center">
        <ul className="list-disc text-[15px] md:text-base leading-[1.35] text-left space-y-2 w-fit pl-5 text-black">
          <li>Permanent location</li>
          <li>Brand establishment</li>
          <li>Best rates</li>
        </ul>
      </div>
    </div>
  </div>
</div>
      </section>

      {/* ═══ REGISTER YOUR INTEREST (Section 5 - Odd - Standard Padding) ═══ */}
      <section className="site-container">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-[40px] font-normal leading-[1.2] mb-3 md:mb-4">
            Register Your Interest
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] text-black/80 max-w-2xl mx-auto">
            Fill out the form below and our team will get back to you within 24
            hours
          </p>
        </div>

        <div
          className="rounded-[24px] md:rounded-[30px] p-5 sm:p-8 lg:p-12 mb-10"
          style={{ background: "#fdf0e9" }}
        >
          <form className="flex flex-col gap-5 md:gap-6">
            {/* Row 1: Business/Brand Name + Contact Person */}
            <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
              <div>
                <p className="text-base md:text-xl capitalize leading-[1.35] mb-2 md:mb-3">
                  Business/Brand Name*
                </p>
                <div className="bg-white rounded-[24px] md:rounded-[33px] flex items-center px-5 md:px-6 h-14 sm:h-16 md:h-[80px]">
                  <input
                    type="text"
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
                  <select className="w-full bg-transparent text-base md:text-lg text-black font-light outline-none capitalize appearance-none cursor-pointer pr-8">
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
                    <path
                      d="M1 1L6.5 6L12 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
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
                    placeholder="Tell us about your goals and interest"
                    className="w-full bg-transparent text-base md:text-lg text-black/60 font-light outline-none placeholder:capitalize"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-black text-white rounded-[24px] md:rounded-[30px] w-full flex items-center justify-center capitalize font-medium text-lg md:text-2xl leading-[1.2] mt-2 h-14 sm:h-16 md:h-[70px] transition-transform active:scale-95"
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
