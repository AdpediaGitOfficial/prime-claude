"use client";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function GsapStack({ selector = "#stack-panels .stack-panel" }: { selector?: string }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const container = document.querySelector("#stack-panels") as HTMLElement | null;
      if (!container) return;

      const panels = gsap.utils.toArray<HTMLElement>(selector);
      if (panels.length < 2) return;

      gsap.set(panels, { zIndex: (i) => i + 1 });
      gsap.set(panels.slice(1), { yPercent: 100 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * panels.length}`,
          scrub: 0.5, 
          pin: true,
          pinSpacing: true,
          anticipatePin: 1, // Ithu normal smooth aakan vendi vechu
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(panel, { yPercent: 0, ease: "none" }, i - 1)
          .to(panels[i - 1], { scale: 0.95, opacity: 0.5, ease: "none" }, i - 1);
      });
      
      tl.to({}, { duration: 0.1 });
    });

    // const timer = setTimeout(() => {
    //   ScrollTrigger.refresh();
    // }, 500);

    return () => {
      // clearTimeout(timer);
      ctx.revert();
    };
  }, [selector]);

  return null;
}