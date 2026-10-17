import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

const W = 1000; // width of internal coordinate system (not px values)
const H = 32;
const MID = H / 2;
const MAX_PULL = 28;
const STRENGTH = 1.8;

const RubberyString = ({ opacity = 1 }: { opacity?: number }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current!;
      const path = pathRef.current!;
      const state = { x: 0.5, y: 0 };

      const draw = () => {
        path.setAttribute(
          "d",
          `M0 ${MID} Q${W * state.x} ${MID + state.y * 2} ${W} ${MID}`,
        );
      };

      draw();

      const mm = gsap.matchMedia();

      mm.add("(hover:hover) and (pointer: fine)", () => {
        const move = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect();
          //distance b/w cursor and mid point of the svg container
          const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;

          gsap.to(state, {
            x: gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width),
            y: gsap.utils.clamp(-MAX_PULL, MAX_PULL, dy),
            duration: 0.35,
            ease: "power3.out",
            overwrite: true,
            onUpdate: draw,
          });
        };

        const leave = () => {
          gsap.to(state, {
            y: 0,
            duration: 2,
            ease: "elastic.out(1.7, 0.2)",
            overwrite: true,
            onUpdate: draw,
          });
        };

        wrap.addEventListener("mousemove", move);
        wrap.addEventListener("mouseleave", leave);
        return () => {
          wrap.removeEventListener("mousemove", move);
          wrap.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: wrapRef },
  );
  return (
    <div className="rubbery-wrap" ref={wrapRef}>
      <svg
        className="rubbery-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-bg)"
          strokeWidth="1"
          strokeOpacity={opacity}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default RubberyString;
