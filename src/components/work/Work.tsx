import "./Work.css";
import { useRef } from "react";
import work1 from "../../assets/images/work1.png";
import work2 from "../../assets/images/work2.png";
import work3 from "../../assets/images/work3.png";
import work4 from "../../assets/images/work4.png";
import work5 from "../../assets/images/work5.png";
import { ArrowUpRight } from "lucide-react";

import { gsap, useGSAP, CustomEase } from "../../lib/gsap";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Project = {
  name: string;
  service: string;
  image: string;
  origin?: Corner;
};

const PROJECTS: Project[] = [
  {
    name: "amber root",
    service: "brand identity",
    image: work1,
    origin: "top-left",
  },
  {
    name: "fernweh",
    service: "art direction",
    image: work2,
    origin: "top-right",
  },
  {
    name: "kindred goods",
    service: "packaging",
    image: work3,
    origin: "top-left",
  },
  {
    name: "vessel line",
    service: "product design",
    image: work4,
    origin: "top-right",
  },
  {
    name: "northline athletics",
    service: "brand strategy",
    image: work5,
    origin: "bottom-left",
  },
];

CustomEase.create("revealOut", "M0,0 C0,0 0,1 1,1");
CustomEase.create("buttonEase", "0.5,0,0,1");

const CLIP_HIDDEN = {
  // top right bottom left
  "top-left": "inset(0% 100% 100% 0%)",
  "top-right": "inset(0% 0% 100% 100%)",
  "bottom-left": "inset(100% 100% 0% 0%)",
  "bottom-right": "inset(100% 0% 0% 100%)",
};
const CLIP_SHOWN = "inset(0% 0% 0% 0%)";

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const projects = gsap.utils.toArray<HTMLElement>(
          ".project",
          sectionRef.current,
        );

        projects.forEach((project) => {
          const wrap = project.querySelector<HTMLElement>(
            ".project-image-wrap",
          )!;
          const img = wrap.querySelector("img");
          const info = project.querySelector<HTMLDivElement>(".project-info");
          const origin =
            (wrap.dataset.origin as Corner | undefined) ?? "top-left";

          const tl = gsap.timeline({
            defaults: { duration: 1.3, ease: "revealOut" },
            scrollTrigger: {
              trigger: project,
              start: "top 72%",
              // markers: true,
            },
          });

          tl.fromTo(
            wrap,
            { clipPath: CLIP_HIDDEN[origin] },
            { clipPath: CLIP_SHOWN, clearProps: "clipPath" },
            0,
          )
            .fromTo(
              img,
              { scale: 1.2 },
              { scale: 1, clearProps: "transform" },
              0,
            )
            .fromTo(
              info,
              {
                opacity: 0,
              },
              { opacity: 1, clearProps: "opacity" },
              0.5,
            );
        });
      });

      mm.add(
        //can the primary input device hover and is the device high precision
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const projects = gsap.utils.toArray<HTMLElement>(
            ".project",
            sectionRef.current,
          );

          const cleanups = projects.map((project) => {
            const fast = project.querySelector<HTMLElement>(".hover-fast");
            const slow = project.querySelector<HTMLElement>(".hover-slow");
            const info = project.querySelector<HTMLElement>(".project-info");
            const info2 =
              project.querySelector<HTMLElement>(".project-info.two");

            const hover = (on: boolean) => {
              gsap.to(fast, {
                scale: on ? 1.03 : 1,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto",
              });
              gsap.to(slow, {
                scale: on ? 1.015 : 1,
                duration: 1.2,
                ease: "power2.out",
                overwrite: "auto",
              });
              gsap.to([info, info2], {
                yPercent: on ? -100 : 0,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto",
              });
            };

            const enter = () => hover(true);
            const leave = () => hover(false);

            project.addEventListener("mouseenter", enter);
            project.addEventListener("mouseleave", leave);

            return () => {
              project.removeEventListener("mouseenter", enter);
              project.removeEventListener("mouseleave", leave);
            };
          });

          return () => cleanups.forEach((fn) => fn());
        },
      );

      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const btn =
            sectionRef.current!.querySelector<HTMLElement>(
              ".browse-all-button",
            )!;

          const texts = gsap.utils.toArray<HTMLElement>(
            ".button-text span",
            btn,
          );

          const buttonIconBg = btn.querySelector(".button-icon-bg");

          const [icon1, icon2] = gsap.utils.toArray<HTMLElement>(
            ".button-icon > span",
            btn,
          );

          const hover = (on: boolean) => {
            const shared = {
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto" as const,
            };

            gsap.to(texts, { yPercent: on ? -100 : 0, ...shared });

            gsap.to(buttonIconBg, { scale: on ? 0.9 : 1, ...shared });

            gsap.to(icon1, { x: on ? 24 : 0, y: on ? -24 : 0, ...shared });

            gsap.to(icon2, {
              xPercent: on ? 100 : 0,
              yPercent: on ? -100 : 0,
              ...shared,
            });
          };

          const enter = () => hover(true);
          const leave = () => hover(false);

          btn.addEventListener("mouseenter", enter);
          btn.addEventListener("mouseleave", leave);
          btn.addEventListener("focus", enter);
          btn.addEventListener("blur", leave);

          return () => {
            btn.removeEventListener("mouseenter", enter);
            btn.removeEventListener("mouseleave", leave);
            btn.removeEventListener("focus", enter);
            btn.removeEventListener("blur", leave);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );
  return (
    <section className="projects" ref={sectionRef}>
      <h2 className="heading">Recent projects</h2>

      <div className="projects-grid">
        {PROJECTS.map(({ name, service, image, origin }, i) => (
          <div className="project" key={i}>
            <div className="project-image-wrap" data-origin={origin}>
              <div className="hover-fast">
                <div className="hover-slow">
                  <img src={image} alt={name} className="project-image" />
                </div>
              </div>
            </div>

            <div className="project-info-mask">
              <div className="project-info">
                <span>{name}</span>
                <span>{service}</span>
              </div>
              <div className="project-info two" aria-hidden="true">
                <span>{name}</span>
                <span>{service}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a href="#" className="browse-all-button">
        <div className="button-content">
          <div className="button-text">
            <span>Browse all work</span>
            <span>Browse all work</span>
          </div>

          <div className="button-icon">
            <div className="button-icon-bg" aria-hidden="true" />
            <span>
              <ArrowUpRight strokeWidth={1.8} size={20} color="#F9F8F5" />
            </span>
            <span>
              <ArrowUpRight strokeWidth={1.8} size={20} color="#F9F8F5" />
            </span>
          </div>
        </div>
      </a>
    </section>
  );
};

export default Work;
