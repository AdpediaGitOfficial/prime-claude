"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { apiCall, ENDPOINTS, assetUrl } from "@/utils/api";

type GalleryItem = { src: string; alt: string; width: number; height: number };

// Default images (fallback if the API is unreachable / has no gallery yet).
const DEFAULT_GALLERY: GalleryItem[] = [
  {
    src: "/POSTER/popup-graphics.jpeg",
    alt: "Prime Promenade event announcement",
    width: 853,
    height: 1280,
  },
  {
    src: "/POSTER/popup-image.jpeg",
    alt: "Prime Promenade featured event announcement",
    width: 1199,
    height: 1600,
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  // Live gallery from the admin (falls back to defaults if unreachable/empty).
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  useEffect(() => {
    let active = true;
    apiCall(ENDPOINTS.GALLERY)
      .then((rows) => {
        if (!active || !Array.isArray(rows)) return;
        const mapped = rows
          .filter((r) => r && r.imagePath)
          .map((r) => ({
            src: assetUrl(r.imagePath),
            alt: (r.title as string) || "Prime Promenade gallery",
            width: 1200,
            height: 1600,
          }));
        if (mapped.length) setGalleryImages(mapped);
      })
      .catch(() => {
        /* keep DEFAULT_GALLERY */
      });
    return () => {
      active = false;
    };
  }, []);

  const showPrevious = () => {
    setSelectedImage((current) =>
      current === null
        ? null
        : (current - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNext = () => {
    setSelectedImage((current) =>
      current === null ? null : (current + 1) % galleryImages.length
    );
  };

  useEffect(() => {
    if (selectedImage === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden bg-[#111] pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e1ff83]/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="site-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#e1ff83]" />
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-white/60 sm:text-sm">
              Prime Promenade
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="max-w-4xl text-5xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[88px]"
          >
            Moments from
            <span className="block text-[#e1ff83]">the Promenade.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Explore the latest experiences, announcements, and celebrations
            happening at Prime Promenade.
          </motion.p>
        </div>
      </section>

      <section className="site-container py-16 md:py-24 lg:py-28">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-14">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-black/45">
              Latest updates
            </p>
            <h2 className="text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl">
              Event Gallery
            </h2>
          </div>
          <p className="text-sm text-black/45">
            {galleryImages.length.toString().padStart(2, "0")} highlights
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {galleryImages.map((image, index) => (
            <motion.button
              key={image.src}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: (index % 6) * 0.06, duration: 0.55 }}
              onClick={() => setSelectedImage(index)}
              className="group relative overflow-hidden rounded-[18px] bg-[#f1f1ed] p-2 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 md:rounded-[24px] md:p-3"
              aria-label={`Open ${image.alt}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[#111] md:rounded-[18px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-10 md:w-10">
                  <Expand className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                </span>
              </div>
              <div className="flex items-center justify-between px-1.5 pb-1 pt-3 md:px-2 md:pt-4">
                <p className="text-sm font-medium md:text-base">Prime Promenade</p>
                <span className="text-xs text-black/45 md:text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e1ff83] sm:right-6 sm:top-6"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute bottom-5 left-[calc(50%_-_3.5rem)] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#e1ff83] sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={galleryImages[selectedImage].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative h-[calc(100dvh-7rem)] w-[min(90vw,720px)]"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute bottom-5 right-[calc(50%_-_3.5rem)] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#e1ff83] sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2"
              aria-label="Next image"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
