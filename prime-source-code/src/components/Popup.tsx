"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { apiCall, ENDPOINTS, assetUrl } from "@/utils/api";
import { safeUrl } from "@/utils/safeUrl";

type Slide = { src: string; href: string; alt: string };

type PopupConfig = {
  enabled: boolean;
  autoplay: number; // seconds; 0 = manual
  frequency: "session" | "always" | "daily";
  scope: "home" | "all";
};

const DEFAULT_CONFIG: PopupConfig = {
  enabled: false,
  autoplay: 5,
  frequency: "session",
  scope: "home",
};

const SEEN_KEY = "pp_popup_seen";

/** Has the visitor already dismissed the pop-up within the configured window? */
function alreadySeen(frequency: PopupConfig["frequency"]): boolean {
  if (frequency === "always") return false;
  try {
    if (frequency === "session") {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    }
    // daily
    const stamp = localStorage.getItem(SEEN_KEY);
    if (!stamp) return false;
    return stamp === new Date().toISOString().slice(0, 10);
  } catch {
    return false;
  }
}

function markSeen(frequency: PopupConfig["frequency"]) {
  try {
    if (frequency === "session") sessionStorage.setItem(SEEN_KEY, "1");
    else if (frequency === "daily") localStorage.setItem(SEEN_KEY, new Date().toISOString().slice(0, 10));
  } catch {
    /* storage may be blocked; ignore */
  }
}

export default function Popup() {
  const pathname = usePathname();
  const [config, setConfig] = useState<PopupConfig>(DEFAULT_CONFIG);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load config + slides once.
  useEffect(() => {
    let active = true;
    Promise.all([
      apiCall(ENDPOINTS.SITE_SETTINGS).catch(() => ({})),
      apiCall(`${ENDPOINTS.BANNERS}?location=popup`).catch(() => []),
    ])
      .then(([settings, banners]) => {
        if (!active) return;
        const raw = (settings as Record<string, unknown>)?.popup;
        const cfg = raw && typeof raw === "object" ? { ...DEFAULT_CONFIG, ...(raw as object) } : DEFAULT_CONFIG;
        setConfig(cfg);
        const mapped: Slide[] = Array.isArray(banners)
          ? banners
              .filter((b) => b && b.imagePath)
              .map((b) => ({
                src: assetUrl(b.imagePath),
                href: safeUrl(b.ctaHref as string),
                alt: (b.title as string) || "Prime Promenade announcement",
              }))
          : [];
        setSlides(mapped);
      })
      .catch(() => {
        /* keep defaults → stays closed */
      });
    return () => {
      active = false;
    };
  }, []);

  // Decide whether to show, once config + slides + route are known.
  useEffect(() => {
    if (!config.enabled || slides.length === 0) return;
    if (config.scope === "home" && pathname !== "/") return;
    if (alreadySeen(config.frequency)) return;
    setCur(0);
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, slides, pathname]);

  const close = useCallback(() => {
    setOpen(false);
    markSeen(config.frequency);
  }, [config.frequency]);

  const go = useCallback(
    (i: number) => setCur(slides.length ? ((i % slides.length) + slides.length) % slides.length : 0),
    [slides.length]
  );

  // Autoplay while open.
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (open && config.autoplay > 0 && slides.length > 1) {
      timer.current = setInterval(() => setCur((c) => (c + 1) % slides.length), config.autoplay * 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [open, config.autoplay, slides.length]);

  // Body scroll lock + keyboard controls.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(cur - 1);
      if (e.key === "ArrowRight") go(cur + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, cur, close, go]);

  const multi = slides.length > 1;
  const active = slides[cur];

  return (
    <AnimatePresence>
      {open && active && (
        <motion.div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Announcement"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-[min(400px,92vw)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close announcement"
              className="absolute -right-2 -top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e1ff83] sm:-right-3 sm:-top-3"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image-only slide frame */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-[#111] shadow-2xl ring-1 ring-white/10">
              {slides.map((s, i) => {
                const img = (
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="400px"
                    className="object-contain"
                    priority={i === 0}
                  />
                );
                return (
                  <div
                    key={s.src + i}
                    className="absolute inset-0 transition-opacity duration-500 ease-out"
                    style={{ opacity: i === cur ? 1 : 0, pointerEvents: i === cur ? "auto" : "none" }}
                  >
                    {s.href ? (
                      <a href={s.href} className="block h-full w-full cursor-pointer" aria-label={s.alt}>
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                );
              })}

              {multi && (
                <>
                  <button
                    type="button"
                    onClick={() => go(cur - 1)}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(cur + 1)}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => go(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === cur ? "w-5 bg-[#e1ff83]" : "w-1.5 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
