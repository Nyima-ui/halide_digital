import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "../../src/lib/gsap";

export let lenis: Lenis | null = null;

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      orientation: "vertical",
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // tick is a function that tells Lenis to update itself on every animation frame, using GSAP's heartbeat. gsap.ticker.add(tick) connects that function to GSAP's ticker, so GSAP's frame loop drives Lenis's scrolling updates.
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);

    //Never try to fast-forward or fake frames. If the browser lags for a millisecond, just stay put and keep moving forward normally frame-by-frame.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return <>{children}</>;
};

export default SmoothScroll;
