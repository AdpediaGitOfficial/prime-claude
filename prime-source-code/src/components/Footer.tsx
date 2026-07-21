"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/LOGO/FOOTER-LOGO.svg"
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { apiCall, ENDPOINTS } from "@/utils/api";

const DEFAULT_SOCIAL = {
  facebook: "https://www.facebook.com/61588610401388/",
  instagram: "https://www.instagram.com/prime_promenade",
};

export default function Footer() {
  // Social links from site settings (fallback to defaults if unreachable).
  const [social, setSocial] = useState(DEFAULT_SOCIAL);
  useEffect(() => {
    let active = true;
    apiCall(ENDPOINTS.SITE_SETTINGS)
      .then((data) => {
        if (!active || !data || typeof data !== "object") return;
        const s = (data as { social?: Partial<typeof DEFAULT_SOCIAL> }).social;
        if (s) setSocial({ ...DEFAULT_SOCIAL, ...s });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-20 mx-4 lg:mx-10 bg-white rounded-[30px] p-8 lg:px-12 lg:py-10" style={{ backdropFilter: "blur(75px)" }}>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
        <div className="flex flex-col gap-5 max-w-xs">
          <Image src={Logo} alt="Prime Promenade" width={180} height={62} className="object-contain" />
          <p className="text-base text-black/60 leading-relaxed">
            A world-class lifestyle destination uniting fitness, wellness, business, and curated experiences under one iconic roof.
          </p>
          <div className="flex items-center gap-4">
            <a href={social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-black transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href={social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-black transition-colors">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
        <nav className="flex flex-col gap-3 text-center lg:text-right lg:pt-2 w-full lg:w-auto items-center lg:items-end">
          <Link href="/" className="text-lg font-semibold text-black capitalize hover:opacity-60 transition-opacity">Home</Link>
          <Link href="/about" className="text-lg font-semibold text-black capitalize hover:opacity-60 transition-opacity">About Us</Link>
          <Link href="/gallery" className="text-lg font-semibold text-black capitalize hover:opacity-60 transition-opacity">Gallery</Link>
          <Link href="/vendor-invite" className="text-lg font-semibold text-black capitalize hover:opacity-60 transition-opacity">Vendor Invite</Link>
          <Link href="/contact" className="text-lg font-semibold text-black capitalize hover:opacity-60 transition-opacity">Contact Us</Link>
        </nav>
      </div>
      <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-base text-black/60 capitalize">Copyright &copy; 2026 – All Right Reserved</p>
        {/* <div className="flex items-center gap-2">
          <p className="text-base text-black/60 capitalize">designed by :</p>
          <Image src="/ICONS/adpedia.svg" alt="Designer" width={117} height={35} />
        </div> */}
      </div>
    </div>
  );
}
