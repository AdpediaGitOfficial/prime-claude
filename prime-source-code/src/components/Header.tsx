"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

    const navLinks = [
      { label: "Home", href: "/" },
    ];

    const dotLinks: { label: string; href?: string; hasMega?: boolean }[] = [
      { label: "Lifestyle", hasMega: true },
      { label: "Wellness", hasMega: true },
      { label: "Prime Pharmas", hasMega: true },
      { label: "Steel Tek", hasMega: true },
      { label: "Prime X Arena", href: "/prime-x-arena" },
      { label: "Vendor Invite", href: "/vendor-invite" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact Us", href: "/contact" },
    ];

    type MenuItem = { title: string; img: string; href: string; sub?: string };

    const lifestyleItems: MenuItem[] = [
      { title: "Venetian Bistro", sub: "Italian Restaurant", img: "/ASSETS/sub-menu-cafe.webp", href: "/cafe" },
      { title: "Regal", sub: "Multipurpose Hall", img: "/ASSETS/regal.jpg", href: "/conference" },
      { title: "FOREVER 4 YOU", sub: "Multi Brand Store", img: "/ASSETS/sub-menu-multi-brand.webp", href: "/vendor" },
    ];

    const wellnessItems: MenuItem[] = [
      { title: "Me Glow Wellness", sub: "SPA & Salon", img: "/ASSETS/sub-menu-spa.webp", href: "/spa" },
      { title: "Hideaway Swimsuit", sub: "Pool", img: "/ASSETS/sub-menu-swimming-pool.webp", href: "/pool-booking" },
      { title: "Oxy Gym", sub: "Fitness", img: "/ASSETS/sub-menu-gym.webp", href: "/gym" },
    ];

    const primePharmasItems: MenuItem[] = [
      { title: "Pharma", img: "/ASSETS/sub-menu-pharmacy.webp", href: "/pharmacy" },
      { title: "Diet and Diabetic Centre", img: "/ASSETS/diet-3.jpg", href: "/pharmacy" },
      { title: "Prime Opticals", img: "/ASSETS/1.jpg", href: "/pharmacy" },
    ];

    const educationItems: MenuItem[] = [
      { title: "Tekla Structures", img: "/ASSETS/study-sub-1.webp", href: "/study-centre#tekla-structures" },
      { title: "Professional Programs", img: "/ASSETS/study-sub-2.webp", href: "/study-centre#advanced-bim-technology" },
    ];

    const steelTekItems: MenuItem[] = [
      { title: "Our Courses", img: "/ASSETS/steeltek-1.jpeg", href: "/study-centre" },
    ];

    const getMegaItems = (label: string) => {
      if (label === "Lifestyle") return lifestyleItems;
      if (label === "Wellness") return wellnessItems;
      if (label === "Prime Pharmas") return primePharmasItems;
      if (label === "Education") return educationItems;
      if (label === "Steel Tek") return steelTekItems;
      return [];
    };

    // const foreverItems = [
    //   { title: "Multi-Brand Retail Store", img: "/ASSETS/sub-menu-multi-brand.webp", href: "/vendor" },
    // ];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sticky on scroll-up logic
  const lastScrollY = useRef(0);
  const [showOnScrollUp, setShowOnScrollUp] = useState(true);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY || 0;
      // set whether we've scrolled past a small threshold
      setScrolledPast(current > 60);

      if (current <= 0) {
        setShowOnScrollUp(true);
        lastScrollY.current = 0;
        return;
      }

      if (current < lastScrollY.current) {
        // scrolling up
        setShowOnScrollUp(true);
      } else if (current > lastScrollY.current) {
        // scrolling down
        setShowOnScrollUp(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Prevent background scroll when menu is open
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile menu when the route/path changes
  const pathname = usePathname();
  useEffect(() => {
    if (open) {
      setOpen(false);
      setExpanded(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close menu when clicking anywhere outside the menu container
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!open) return;
      if (!containerRef.current) return;
      const target = e.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
        setExpanded(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const logoClass = `block w-[160px] sm:w-[200px] transition-opacity duration-200 ${open ? "opacity-0 pointer-events-none z-40" : "opacity-100 z-[60]"} lg:opacity-100 lg:pointer-events-auto lg:z-[60]`;
  const menuBtnClass = `flex items-center gap-3 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full transition-all duration-300 z-[70] relative ${open ? "bg-transparent" : "bg-white/20 backdrop-blur-md border border-white/30"} text-white font-light text-[16px] sm:text-[22px] ${open ? "opacity-0 pointer-events-none" : "opacity-100"} lg:opacity-100 lg:pointer-events-auto`;

  // Framer-motion variants for mobile menu open animation
  const mobileNavVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.06, duration: 0.32 },
    },
    exit: { opacity: 0, y: 12, transition: { when: "afterChildren", duration: 0.2 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.24 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.26 } },
  };

  // When user hasn't scrolled past threshold, keep header positioned absolute over the hero.
  // Only switch to `fixed` (sticky) after passing the threshold (`scrolledPast`).
  // When fixed, show on scroll-up with black background and a light drop shadow.
  const headerWrapperClass = open
    ? "fixed top-0 left-0 right-0 z-[100] bg-transparent"
    : `${scrolledPast ? 'fixed top-0 left-0 right-0 z-50' : 'absolute top-0 left-0 right-0 z-50'} transition-transform duration-300 ${
        scrolledPast
          ? showOnScrollUp
            ? 'translate-y-0 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-md'
            : '-translate-y-full'
          : 'translate-y-0 bg-transparent'
      }`;

  return (
    <header className={headerWrapperClass}>
      <div className="site-container flex items-center justify-between py-4">
        <Link href="/" className={logoClass}>
          <Image src="/LOGO/logo-main-white.svg" alt="Prime Promenade" width={280} height={50} className="w-full h-auto" />
        </Link>

        <div ref={containerRef} className="relative">
        {/* Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className={menuBtnClass}
        >
          <span>Menu</span>
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
            ))}
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <>
              {/* Overlay Background */}
              <motion.div
                className="hidden lg:block fixed inset-0 z-40 bg-black/10"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Desktop / large screens (unchanged) */}
              <motion.nav
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, layout: { duration: 0.25 } }}
                className="hidden lg:flex absolute top-[-10px] right-[-10px] z-50 rounded-[30px] pt-24 pb-16 px-12 flex-row items-start gap-8 border border-white/10 shadow-2xl text-white overflow-hidden bg-black/95"
                style={{
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                }}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {/* --- Left Side: Mega Menu Content (desktop) --- */}
                <motion.div className="relative flex items-start" layout>
                  <AnimatePresence mode="wait">
                    {hoveredLink === "Lifestyle" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ layout: { duration: 0.22 }, type: "spring", stiffness: 300, damping: 28 }}
                        className="flex flex-col gap-6 pr-8 border-r border-white/30 min-w-[600px] justify-start self-start mb-[-50px]"
                      >
                        <h2 className="text-white text-[32px] font-semi mb-[-20px]">Lifestyle</h2>
                        <div className="grid grid-cols-3 gap-5">
                          {lifestyleItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => { setOpen(false); setExpanded(null); }}
                              className="group block"
                            >
                              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10">
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <p className="text-white font-light text-[18px]">{item.title}</p>
                              {item.sub && (
                                <p className="text-white/50 font-light text-[14px] mt-0.5">{item.sub}</p>
                              )}
                            </Link>
                          ))}
                        </div>

                      </motion.div>
                    )}

                    {hoveredLink === "Wellness" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ layout: { duration: 0.22 }, type: "spring", stiffness: 300, damping: 28 }}
                        className="flex flex-col gap-6 pr-8 border-r border-white/30 min-w-[600px] justify-start self-start mb-[-50px]"
                      >
                        <h2 className="text-white text-[32px] font-semi mb-[-20px]">Wellness</h2>
                        <div className="grid grid-cols-3 gap-5">
                          {wellnessItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => { setOpen(false); setExpanded(null); }}
                              className="group block"
                            >
                              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10">
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <p className="text-white font-light text-[18px]">{item.title}</p>
                              {item.sub && (
                                <p className="text-white/50 font-light text-[14px] mt-0.5">{item.sub}</p>
                              )}
                            </Link>
                          ))}
                        </div>

                      </motion.div>
                    )}
                    {hoveredLink === "Prime Pharmas" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ layout: { duration: 0.22 }, type: "spring", stiffness: 300, damping: 28 }}
                        className="flex flex-col gap-6 pr-8 border-r border-white/30 min-w-[600px] justify-start self-start mb-[-50px]"
                      >
                        <h2 className="text-white text-[32px] font-semi mb-[-20px]">Prime Pharmas</h2>
                        <div className="grid grid-cols-3 gap-5">
                          {primePharmasItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => { setOpen(false); setExpanded(null); }}
                              className="group block"
                            >
                              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10">
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <p className="text-white font-light text-[18px]">{item.title}</p>
                              {item.sub && (
                                <p className="text-white/50 font-light text-[14px] mt-0.5">{item.sub}</p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {hoveredLink === "Education" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ layout: { duration: 0.22 }, type: "spring", stiffness: 300, damping: 28 }}
                        className="flex flex-col gap-10 pr-10 border-r border-white/30 min-w-[600px] justify-start self-start mb-[-50px]"
                      >
                        <h2 className="text-white text-[32px] font-semi mb-[-20px]">Education</h2>
                        <div className="grid grid-cols-3 gap-5">
                          {educationItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => { setOpen(false); setExpanded(null); }}
                              className="group block"
                            >
                              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10">
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <p className="text-white font-light text-[18px]">{item.title}</p>
                              {item.sub && (
                                <p className="text-white/50 font-light text-[14px] mt-0.5">{item.sub}</p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {hoveredLink === "Steel Tek" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ layout: { duration: 0.22 }, type: "spring", stiffness: 300, damping: 28 }}
                        className="flex flex-col gap-6 pr-8 border-r border-white/30 min-w-[600px] justify-start self-start mb-[-50px]"
                      >
                        <h2 className="text-white text-[32px] font-semi mb-[-20px]">Steel Tek</h2>
                        <div className="grid grid-cols-3 gap-5">
                          {steelTekItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              onClick={() => { setOpen(false); setExpanded(null); }}
                              className="group block"
                            >
                              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-white/10">
                                <Image
                                  src={item.img}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <p className="text-white font-light text-[18px]">{item.title}</p>
                              {item.sub && (
                                <p className="text-white/50 font-light text-[14px] mt-0.5">{item.sub}</p>
                              )}
                            </Link>
                          ))}
                        </div>

                      </motion.div>
                    )}

                    
                  </AnimatePresence>
                </motion.div>

                {/* --- Right Side: Main Links (desktop) --- */}
                <motion.div layout className="flex flex-col items-end gap-4 min-w-[260px]">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(null)}
                      onClick={() => { setOpen(false); setExpanded(null); }}
                      className="text-white text-[20px] font-light hover:opacity-60 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {dotLinks.map((link) => (
                    <div
                      key={link.label}
                      onMouseEnter={link.hasMega ? () => setHoveredLink(link.label) : () => setHoveredLink(null)}
                      className="w-full"
                    >
                      {link.href ? (
                        <Link
                          href={link.href}
                          onClick={() => { setOpen(false); setExpanded(null); }}
                          className="group flex items-center gap-3 justify-end w-full text-white text-[20px] font-light hover:opacity-60 transition-opacity"
                        >
                          {link.hasMega && (
                            <span className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${
                              hoveredLink === link.label ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : ""
                            }`} />
                          )}
                          {link.label}
                        </Link>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          className="group flex items-center gap-3 justify-end w-full text-white text-[20px] font-light hover:opacity-60 transition-opacity cursor-default"
                        >
                          {link.hasMega && (
                            <span className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${
                              hoveredLink === link.label ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : ""
                            }`} />
                          )}
                          {link.label}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </motion.nav>

              {/* Mobile / small screens: full-screen drawer with accordions */}
              <motion.nav
                variants={mobileNavVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="lg:hidden fixed inset-0 z-[999] h-dvh min-h-screen bg-black text-white overflow-y-auto overscroll-contain"
              >
                <motion.div
                  variants={headerVariants}
                  className="sticky top-0 z-10 flex items-center justify-between bg-black px-5 py-5"
                >
                  <Link href="/" onClick={() => setOpen(false)} className="block w-[155px]">
                    <Image
                      src="/LOGO/logo-main-white.svg"
                      alt="Prime Promenade"
                      width={280}
                      height={50}
                      className="h-auto w-full"
                      priority
                    />
                  </Link>
                  <button
                    onClick={() => { setOpen(false); setExpanded(null); }}
                    aria-label="Close menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </motion.div>

                <motion.ul className="flex flex-col px-5 pb-10 pt-4">
                  {navLinks.map((link) => (
                    <motion.li key={link.label} variants={itemVariants} className="border-b border-white/10">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-4 text-[26px] font-light leading-tight text-white"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}

                  {dotLinks.map((link) => (
                    <motion.li key={link.label} variants={itemVariants} className="w-full border-b border-white/10">
                      {link.hasMega ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                            aria-expanded={expanded === link.label}
                            className="flex w-full items-center justify-between gap-4 py-4 text-left"
                          >
                            <span className="text-[26px] font-light leading-tight text-white">
                              {link.label}
                            </span>
                            <ChevronDown
                              size={24}
                              strokeWidth={1.8}
                              className={`shrink-0 transition-transform duration-200 ${expanded === link.label ? "rotate-180" : "rotate-0"}`}
                            />
                          </button>

                          <AnimatePresence>
                            {expanded === link.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="grid grid-cols-1 gap-3 overflow-hidden pb-4 sm:grid-cols-2"
                              >
                                {getMegaItems(link.label).map((item) => (
                                  <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => { setOpen(false); setExpanded(null); }}
                                    className="group flex min-h-[84px] items-center gap-4 rounded-lg bg-white/[0.06] p-2"
                                  >
                                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10">
                                      <Image src={item.img} alt={item.title} fill className="object-cover" />
                                    </div>
                                    <span className="flex flex-col">
                                      <span className="text-base font-light leading-snug text-white">{item.title}</span>
                                      {item.sub && (
                                        <span className="text-sm font-light leading-snug text-white/50">{item.sub}</span>
                                      )}
                                    </span>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href ?? '#'}
                          onClick={() => setOpen(false)}
                          className="block py-4 text-[26px] font-light leading-tight text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
