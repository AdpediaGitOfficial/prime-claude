"use client";

import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

export default function ScrollTopArrow() {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y === 0) {
        setVisible(false);
        lastY.current = 0;
        return;
      }

      // show when user scrolls up and passed threshold
      if (y < lastY.current && y > 60) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setVisible(false);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed right-6 bottom-8 z-60 flex items-center justify-center w-12 h-12 rounded-full transition-transform transition-opacity duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      } bg-black/60 backdrop-blur-md hover:bg-black/70 border border-white/10 text-white`}
    >
      <AiOutlineArrowUp className="w-5 h-5" />
    </button>
  );
}