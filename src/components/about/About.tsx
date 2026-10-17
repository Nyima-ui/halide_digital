import { useRef } from "react";
import "./About.css";
import { gsap, SplitText, CustomEase, useGSAP } from "../../lib/gsap";

CustomEase.create("aboutEase", "0,0,0,1");

const STAT_Y = 100;
const STATS_DURATION = 1.828;
const COUNT_DURATION = 1.008;

const OPACITY_STEPS: [number, number, string][] = [
  [0.045, 0.00183, "0,0,1,1"],
  [0.06, 0.00189, "0,0,1,1"],
  [0.08, 0.00347, "0,0,1,1"],
  [0.11, 0.00716, "0,0,1,1"],
  [0.155, 0.01438, "0,0,1,1"],
  [0.22, 0.02839, "0.261,0.311,0.589,0.645"],
  [0.312, 0.05712, "0.26,0.313,0.588,0.648"],
  [0.443, 0.11418, "0.26,0.316,0.588,0.652"],
  [0.62, 0.22858, "0.26,0.323,0.588,0.66"],
  [0.84, 0.457, "0.305,0.404,0.649,0.739"],
  [1, 0.914, "0.301,0.615,0.648,1"],
];

OPACITY_STEPS.forEach(([, , bezier], i) =>
  CustomEase.create(`aboutOpacity${i}`, bezier),
);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      SplitText.create(paraRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(paraRef.current, { visibility: "visible" });

          return gsap.from(self.lines, {
            yPercent: 128,
            rotation: 2,
            opacity: 0.38,
            transformOrigin: "50% 50%",
            ease: "aboutEase",
            duration: 1.2,
            stagger: 0.03,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 40%",
              toggleActions: "play none none none",
              // markers: true,
            },
          });
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });

      tl.from(
        ".stat",
        { y: STAT_Y, duration: STATS_DURATION, ease: "aboutEase" },
        0,
      );

      let t = 0;
      OPACITY_STEPS.forEach(([opacity, duration], i) => {
        const vars = { opacity, duration, ease: `aboutOpacity${i}` };
        if (i === 0) tl.fromTo(".stat", { opacity: 0 }, vars, t);
        else tl.to(".stat", vars, t);
        t += duration;
      });

      gsap.utils.toArray<HTMLElement>(".counter-value").forEach((el) => {
        const from = Number(el.dataset.from);
        const to = Number(el.dataset.to);
        const state = { value: from };
        el.textContent = String(from);
        tl.to(
          state,
          {
            value: to,
            duration: COUNT_DURATION,
            ease: "none",
            onUpdate: () => {
              el.textContent = String(Math.floor(state.value));
            },
          },
          0,
        );
      });

      const mm = gsap.matchMedia();

      mm.add("(max-width: 479.98px)", () => {
        gsap.fromTo(
          ".stat",
          { "--stat-underline": 0 },
          {
            "--stat-underline": 1,
            duration: 1.2,
            ease: "aboutEase",
            stagger: 0.2,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
              // markers: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  const stats = [
    {
      from: 20,
      number: 80,
      label: "(Projects)",
      para: "Shipped for clients across every stage of growth.",
      operation: "+",
    },
    {
      from: 0,
      number: 12,
      label: "(Years)",
      para: "Combined experience across the founding team.",
      operation: "",
    },
    {
      from: 20,
      number: 95,
      label: "(Retention)",
      para: "Clients who come back for their next project.",
      operation: "%",
    },
    {
      from: 0,
      number: 20,
      label: "(Countries)",
      para: "Worked with founders and teams around the world.",
      operation: "+",
    },
  ];
  return (
    <section className="about-us" ref={sectionRef}>
      <div className="content">
        <h2 className="heading">About us</h2>
        <p className="paragraph" ref={paraRef}>
          <span className="indent" aria-hidden="true" />
          We're a design studio for founders who'd rather their product speak
          for itself, but know it needs help getting there first. We build
          sites, brands, and systems that hold up under real scrutiny — from
          investors, from customers, from anyone paying attention. Small team,
          senior work, nothing outsourced to keep the lights on.
        </p>
      </div>

      <div className="stats" ref={statsRef}>
        {stats.map((stat, i) => (
          <div className="stat" key={i}>
            <div className="top">
              <span className="counter">
                <span className="counter-ghost">{stat.number}</span>
                <span
                  className="counter-value"
                  aria-hidden="true"
                  data-from={stat.from}
                  data-to={stat.number}
                >
                  {stat.from}
                </span>
              </span>
              <span>{stat.label}</span>
            </div>

            <div className="bottom">
              <p>{stat.para}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
