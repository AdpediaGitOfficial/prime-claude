import Banner from "../../../public/ASSETS/TERM-CONDITION.webp"

export const metadata = { title: "Terms & Conditions – Prime Promenade" };

export default function TermsPage() {
  return (
    <div className="bg-white text-black overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:h-[730px]">
        <img
          src={Banner.src}
          alt="Terms &amp; Conditions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47%,rgba(0,0,0,0.9) 100%)" }}
        ></div>
        <div className="relative h-full flex flex-col items-center justify-end pb-20 pt-32 px-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-[76px] font-normal leading-tight tracking-[-0.02em] text-white mb-8">
            Terms &amp; Conditions
          </h1>
          <p className="text-xl leading-[1.3] text-white max-w-[869px]">
            Welcome to our website. By using this site, you agree to the terms and conditions. Please read them carefully.
          </p>
        </div>
      </section>

      {/* ═══ TERMS CONTENT ═══ */}
      <section className="py-16 lg:py-24 px-8 lg:px-16 xl:px-36">
        <div className="max-w-[1640px] mx-auto text-black">
          <h2 className="text-[22px] font-medium leading-[1.2] mb-4">1. Acceptance of Terms</h2>
          <p className="text-xl leading-[1.2] mb-8">
            By accessing this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using this website.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">2. Use of the Website</h2>
          <p className="text-xl leading-[1.35] mb-8">
            This website is intended to provide information about our services and facilities. Users agree to use the website responsibly and not engage in any activity that may harm, disrupt, or misuse the platform.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">3. Service Information</h2>
          <p className="text-xl leading-[1.35] mb-8">
            The information provided on this website regarding services, facilities, and offerings is for general informational purposes only. Certain services, bookings, or confirmations may require direct communication or offline verification.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">4. Booking and Enquiries</h2>
          <p className="text-xl leading-[1.35] mb-8">
            Some services on this website allow users to submit booking requests or enquiries. Submitting a request does not guarantee confirmation. Final confirmation may be provided by the management through offline communication.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">5. User Information</h2>
          <p className="text-xl leading-[1.35] mb-8">
            Users agree to provide accurate and complete information when submitting forms or enquiries. We are not responsible for issues caused by incorrect or incomplete information provided by users.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">6. Intellectual Property</h2>
          <p className="text-xl leading-[1.35] mb-8">
            All content on this website, including text, images, graphics, and design elements, is the property of the website owner unless otherwise stated. Unauthorized use, reproduction, or distribution is strictly prohibited.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">7. Third-Party Links</h2>
          <p className="text-xl leading-[1.35] mb-8">
            This website may contain links to external websites or services. We are not responsible for the content, policies, or practices of third-party websites.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">8. Limitation of Liability</h2>
          <p className="text-xl leading-[1.35] mb-8">
            We strive to ensure that the information on this website is accurate and up to date. However, we do not guarantee the completeness or accuracy of all content and are not liable for any direct or indirect damages arising from the use of this website.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">9. Changes to Terms</h2>
          <p className="text-xl leading-[1.35] mb-8">
            We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the website after any changes indicates acceptance of the updated terms.
          </p>

          <h2 className="text-[22px] font-medium leading-[1.35] mb-4">10. Contact Information</h2>
          <p className="text-xl leading-[1.35]">
            If you have any questions regarding these Terms and Conditions, please contact us through the contact details provided on our website.
          </p>
        </div>
      </section>

      {/* ═══ CONTACT SECTION (removed) ═══ */}
    </div>
  );
}
