import { PiStudent, PiHourglassHigh } from "react-icons/pi";

export const metadata = { title: "Study Centre – Prime Promenade" };

export default function StudyCentrePage() {
  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ═══ HERO (Section 1 - Odd) ═══ */}
      <section className="relative w-full h-[450px] md:h-[100vh] md:min-h-[100vh] lg:min-h-[100vh] overflow-hidden">
        <img
          src="/ASSETS/study-center-main-banner.webp"
          alt="Study Centre"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47.9%,rgba(0,0,0,0.9) 100%)",
          }}
        />

        <div className="site-container relative h-full flex flex-col items-center justify-end !pb-16 md:!pb-24 !pt-32 md:!pt-40 text-center w-full">
    
          <img src="/Service-logo/final-out-04.png" alt="Steeltek" className="mx-auto w-[150px] md:w-[150px] lg:w-[200px] object-contain mb-4 md:mb-5 max-w-4xl" />
          <p className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.3] max-w-2xl px-2 sm:px-0">
            Specialized education and research centre for Tekla training
          </p>
        </div>
      </section>

      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-4 md:mb-6">
            About Steeltek
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-4xl mx-auto text-black/80">
            Steel Tek by Prime is a specialized education and research center for structural steel design and Tekla training, focused on delivering industry-oriented expertise in structural steel and detailing. The institute is designed to bridge the gap between academic learning and real-world industry requirements by providing practical, hands-on training led by experienced professionals.
          </p>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-8 md:mt-12">
         
          <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col min-h-[280px] md:min-h-[433px]">
            <img
              src="/ICONS/Industry-Focused-Training.png"
              alt=""
              className="w-12 h-12 md:w-[62px] md:h-[62px] object-contain mb-auto"
            />
            <div className="mt-auto pt-8 md:pt-12">
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2 md:mb-3">
                Industry-Focused Training
              </p>
              <p className="text-base md:text-[18px] leading-[1.35] text-black/80">
                Our curriculum is designed in collaboration with industry
                experts to ensure relevance and practical applicability.
              </p>
            </div>
          </div>

         
          <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col min-h-[280px] md:min-h-[433px]">
            <img
              src="/ICONS/Expert-Instructors.png"
              alt=""
              className="w-12 h-12 md:w-[62px] md:h-[62px] object-contain mb-auto"
            />
            <div className="mt-auto pt-8 md:pt-12">
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2 md:mb-3">
                Expert Instructors
              </p>
              <p className="text-base md:text-[18px] leading-[1.35] text-black/80">
                Learn from experienced professionals who bring real-world
                insights and expertise to the classroom.
              </p>
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col min-h-[280px] md:min-h-[433px]">
            <img
              src="/ICONS/Modern-Learning-Methods.png"
              alt=""
              className="w-12 h-12 md:w-[62px] md:h-[62px] object-contain mb-auto"
            />
            <div className="mt-auto pt-8 md:pt-12">
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2 md:mb-3">
                Modern Learning Methods
              </p>
              <p className="text-base md:text-[18px] leading-[1.35] text-black/80">
                We employ cutting-edge teaching techniques, interactive
                sessions, and hands-on projects for effective learning.
              </p>
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 md:p-8 flex flex-col min-h-[280px] md:min-h-[433px]">
            <img
              src="/ICONS/Career-Success.png"
              alt=""
              className="w-12 h-12 md:w-[62px] md:h-[62px] object-contain mb-auto"
            />
            <div className="mt-auto pt-8 md:pt-12">
              <p className="text-xl md:text-[22px] font-medium leading-[1.35] mb-2 md:mb-3">
                Career Success
              </p>
              <p className="text-base md:text-[18px] leading-[1.35] text-black/80">
                We focus on building practical skills and knowledge that
                translate directly into successful careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2]">
            Courses Offered
          </h2>
          <p className="text-base md:text-xl leading-[1.35] lg:max-w-sm text-left lg:text-right text-black/80">
            Professional courses designed to elevate your career
          </p>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">

          <div className="bg-[#e8ecec] rounded-[24px] md:rounded-[30px] p-4 sm:p-5 flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch" id="tekla-structures">
            {/* Image (Left) */}
            <div className="w-full lg:w-[40%] flex-shrink-0 rounded-[20px] md:rounded-[24px] overflow-hidden min-h-[250px] md:min-h-[350px]">
              <img
                src="/ASSETS/study-sub-1.webp"
                alt="Tekla Structures Class"
                className="w-full h-full object-cover min-h-[250px] md:min-h-[350px]"
              />
            </div>

            {/* Details (Right) */}
            <div className="flex flex-col gap-4 md:gap-5 flex-1 justify-center py-2 lg:py-4 pr-2 lg:pr-8">
              <h3 id="tekla-structures" className="text-xl md:text-2xl lg:text-[28px] font-semi leading-[1.2]">
                Tekla Structures – Basic to Advanced
              </h3>

              {/* Bullet Points */}
              <ul className="flex flex-col gap-2 pl-5 list-disc text-sm md:text-base lg:text-[18px] leading-[1.4] text-black">
                <li>Intro to Tekla</li>
                <li>3D Modeling (Steel, PEB, Concrete)</li>
                <li>Components</li>
                <li>Drawings &amp; BOM</li>
              </ul>

              {/* Meta Info (Icons) */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-start gap-3">
                  <PiStudent className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-black" />
                  <div>
                    <p className="text-sm md:text-base lg:text-[18px] font-medium">Eligibility:</p>
                    <ul className="list-disc pl-5 text-sm md:text-base text-black/80 mt-1">
                      <li>Civil/Mechanical Engineering students (Diploma/B.Tech)</li>
                      <li>Structural Engineers</li>
                      <li>Draughtsmen &amp; Designers</li>
                      <li>Working Professionals</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PiHourglassHigh className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-black" />
                  <div>
                    <p className="text-sm md:text-base lg:text-[18px] font-medium">Duration:</p>
                    <p className="text-sm md:text-base text-black/80 mt-1">Starting from 100-120 hours</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4 mt-6">
                <button className="bg-black text-white text-sm md:text-base lg:text-[18px] font-medium capitalize rounded-[24px] md:rounded-[30px] px-8 md:px-12 py-3 md:py-4 hover:bg-[#222] transition-colors flex-1 sm:flex-none">
                  View Details
                </button>
                <button className="bg-black text-white text-sm md:text-base lg:text-[18px] font-medium capitalize rounded-[24px] md:rounded-[30px] px-8 md:px-12 py-3 md:py-4 hover:bg-[#222] transition-colors flex-1 sm:flex-none">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>

          {/* Course 2: Advanced BIM Technology -- Details LEFT, Image RIGHT */}
          <div className="bg-[#e8ecec] rounded-[24px] md:rounded-[30px] p-4 sm:p-5 flex flex-col lg:flex-row-reverse gap-6 lg:gap-10 items-stretch" id="advanced-bim-technology">
            {/* Image (Right on Desktop, Top on Mobile) */}
            <div className="w-full lg:w-[40%] flex-shrink-0 rounded-[20px] md:rounded-[24px] overflow-hidden min-h-[250px] md:min-h-[350px]">
              <img
                src="/ASSETS/study-sub-2.webp"
                alt="Advanced BIM Technology"
                className="w-full h-full object-cover min-h-[250px] md:min-h-[350px]"
              />
            </div>

            {/* Details (Left on Desktop, Bottom on Mobile) */}
            <div className="flex flex-col gap-4 md:gap-5 flex-1 justify-center py-2 lg:py-4 px-2 lg:pl-8 lg:pr-4">
              <h3 id="advanced-bim-technology" className="text-xl md:text-2xl lg:text-[28px] font-semi leading-[1.2]">
                Structural Steel Design - Basic to Advanced
              </h3>

              {/* Bullet Points */}
              <ul className="flex flex-col gap-2 pl-5 list-disc text-sm md:text-base lg:text-[18px] leading-[1.4] text-black">
                <li>Introduction to Structural Engineering </li>
                <li>Structural Analysis and Design based on IS and AISC codes </li>
                <li>RCC substructure and Steel Design Principles</li>
                <li>So ware Basics(Matrix/STAAD)</li>
              </ul>

              {/* Meta Info (Icons) */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-start gap-3">
                  <PiStudent className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-black" />
                  <div>
                    <p className="text-sm md:text-base lg:text-[18px] font-medium">Eligibility:</p>
                    <ul className="list-disc pl-5 text-sm md:text-base text-black/80 mt-1">
                      <li>Civil Engineering students (B.Tech/M.Tech)</li>
                      <li>Architectural Students</li>
                      <li>Designers</li>
                      <li>Working Professionals</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PiHourglassHigh className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-black" />
                  <div>
                    <p className="text-sm md:text-base lg:text-[18px] font-medium">Duration:</p>
                    <p className="text-sm md:text-base text-black/80 mt-1">Starting from 100-120 hours</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4 mt-6">
                <button className="bg-black text-white text-sm md:text-base lg:text-[18px] font-medium capitalize rounded-[24px] md:rounded-[30px] px-8 md:px-12 py-3 md:py-4 hover:bg-[#222] transition-colors flex-1 sm:flex-none">
                  View Details
                </button>
                <button className="bg-black text-white text-sm md:text-base lg:text-[18px] font-medium capitalize rounded-[24px] md:rounded-[30px] px-8 md:px-12 py-3 md:py-4 hover:bg-[#222] transition-colors flex-1 sm:flex-none">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS & RECOGNITION (Section 4 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-4 md:mb-5">
            Certifications &amp; Recognition
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-3xl mx-auto text-black/80">
            Upon successful completion of your course, you&apos;ll receive
            industry-recognized certifications that validate your skills and
            enhance your professional credentials.
          </p>
        </div>

        <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 sm:p-8 lg:px-20 lg:py-16">
          {/* 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 md:gap-y-10 gap-x-6 mb-8 md:mb-10">
            <div className="flex items-start gap-3 md:gap-4 w-full">
              <span className="text-lg md:text-[22px] leading-none flex-shrink-0 mt-1 text-[#604b9e]">
                ✦
              </span>
              <div>
                <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Industry-Recognised Certificates
                </p>
                <p className="text-base lg:text-[20px] leading-[1.35] text-black/80">
                  Receive certificates that are valued and recognized by leading
                  companies across various industries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4 w-full">
              <span className="text-lg md:text-[22px] leading-none flex-shrink-0 mt-1 text-[#604b9e]">
                ✦
              </span>
              <div>
                <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Verified Credentials
                </p>
                <p className="text-base lg:text-[20px] leading-[1.35] text-black/80">
                  All certifications are digitally verified and can be shared on
                  professional networks like LinkedIn.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4 w-full">
              <span className="text-lg md:text-[22px] leading-none flex-shrink-0 mt-1 text-[#604b9e]">
                ✦
              </span>
              <div>
                <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Career Advancement
                </p>
                <p className="text-base lg:text-[20px] leading-[1.35] text-black/80">
                  Boost your career prospects with credentials that demonstrate
                  your expertise and commitment to professional growth.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4 w-full">
              <span className="text-lg md:text-[22px] leading-none flex-shrink-0 mt-1 text-[#604b9e]">
                ✦
              </span>
              <div>
                <p className="text-xl lg:text-[25px] font-medium leading-[1.2] mb-2 md:mb-4">
                  Global Recognition
                </p>
                <p className="text-base lg:text-[20px] leading-[1.35] text-black/80">
                  Our certifications are accepted worldwide, opening doors to
                  international career opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Receive -- white card */}
          <div className="bg-white rounded-[24px] md:rounded-[33px] p-6 sm:p-8 lg:px-12 lg:py-10 shadow-sm">
            <p className="text-xl md:text-2xl lg:text-[25px] font-medium leading-[1.2] mb-4 md:mb-6">
              What You&apos;ll Receive
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 md:gap-x-8">
              <p className="text-base md:text-lg lg:text-[18px] leading-[1.35] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                Official course completion certificate from Trimble for Tekla
              </p>
              <p className="text-base md:text-lg lg:text-[18px] leading-[1.35] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                Digital badge for professional profiles
              </p>
              <p className="text-base md:text-lg lg:text-[18px] leading-[1.35] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                Access to alumni network and resources
              </p>
              <p className="text-base md:text-lg lg:text-[18px] leading-[1.35] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                Career support and job placement assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLASSROOM FACILITIES (Section 5 - Odd - Standard Padding) ═══ */}
      <section className="site-container py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-4 md:mb-5">
            Classroom Facilities
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-2xl mx-auto text-black/80">
            Experience world-class learning infrastructure designed to foster
            innovation, collaboration, and practical skill development.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          <div className="flex flex-col gap-3">
            <div className="rounded-[20px] overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[448px]">
              <img
                src="/ASSETS/study-card-2.webp"
                alt="Modern Classrooms"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <p className="text-lg md:text-[18px] lg:text-[20px] font-medium text-center leading-[1.35]">
              Modern Classrooms
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[20px] overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[448px]">
              <img
                src="/ASSETS/study-card-1.webp"
                alt="Advanced Training Equipment"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <p className="text-lg md:text-[18px] lg:text-[20px] font-medium text-center leading-[1.35]">
              Advanced Training Equipment
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[20px] overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[448px]">
              <img
                src="/ASSETS/study-card-4.webp"
                alt="Practical Lab Sessions"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <p className="text-lg md:text-[18px] lg:text-[20px] font-medium text-center leading-[1.35]">
              Practical Lab Sessions
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-[20px] overflow-hidden h-[250px] sm:h-[300px] md:h-[350px] lg:h-[448px]">
              <img
                src="/ASSETS/study-card-3.webp"
                alt="Interactive Learning Environment"
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <p className="text-lg md:text-[18px] lg:text-[20px] font-medium text-center leading-[1.35]">
              Interactive Learning Environment
            </p>
          </div>
        </div>
      </section>

      {/* ═══ COURSE REGISTRATION (Section 6 - Even - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-3 md:mb-5">
            Course Registration
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-[1.35] max-w-md mx-auto text-black/80">
            Take the first step towards your professional growth. Fill out the
            form below to register.
          </p>
        </div>

        <div className="bg-[#f5f5f5] rounded-[24px] md:rounded-[30px] p-6 sm:p-8 lg:px-20 lg:py-16">
          <div className="mb-6 md:mb-8">
            <p className="text-xl md:text-[25px] font-medium leading-[1.2] mb-2">
              Register for a Course
            </p>
            <p className="text-base md:text-[20px] leading-[1.35] text-black/80">
              Please provide your details and we&apos;ll get back to you within
              24 hours.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5 md:gap-6">
            {/* Row 1: Full Name + Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Full Name*
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center">
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-transparent text-base md:text-[18px] text-black outline-none placeholder-black/40"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Email Address*
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-transparent text-base md:text-[18px] text-black outline-none placeholder-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone + Course Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Phone Number*
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center">
                  <input
                    type="tel"
                    placeholder="Enter full phone number"
                    className="w-full bg-transparent text-base md:text-[18px] text-black outline-none placeholder-black/40"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Course Selection*
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center relative">
                  <select defaultValue="" className="w-full bg-transparent text-base md:text-[18px] text-black/60 outline-none appearance-none cursor-pointer pr-8">
                    <option value="" disabled>
                      Select a course
                    </option>
                    <option value="facade">Facade Design Engineering</option>
                    <option value="bim">Advanced BIM Technology</option>
                  </select>
                  <svg
                    className="absolute right-5 pointer-events-none"
                    width="14"
                    height="8"
                    viewBox="0 0 19 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L9.5 9L18 1"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 3: Mode of Learning + Message */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Mode of Learning*
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center relative">
                  <select defaultValue="" className="w-full bg-transparent text-base md:text-[18px] text-black/60 outline-none appearance-none cursor-pointer pr-8">
                    <option value="" disabled>
                      Select learning mode
                    </option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="ondemand">OnDemand</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <svg
                    className="absolute right-5 pointer-events-none"
                    width="14"
                    height="8"
                    viewBox="0 0 19 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L9.5 9L18 1"
                      stroke="black"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-base md:text-[20px] capitalize">
                  Message (Optional)
                </label>
                <div className="bg-white rounded-[24px] md:rounded-[33px] px-5 py-3 h-14 md:h-[80px] flex items-center">
                  <input
                    type="text"
                    placeholder="Tell us about your goals and interest"
                    className="w-full bg-transparent text-base md:text-[18px] text-black outline-none placeholder-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button className="w-full bg-black text-white text-lg md:text-[24px] font-medium capitalize rounded-[24px] md:rounded-[30px] h-14 md:h-[80px] hover:bg-[#222] transition-transform active:scale-95">
                Register for the Course
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
