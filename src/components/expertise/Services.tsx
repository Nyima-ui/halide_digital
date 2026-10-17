import "./Services.css";
import image1 from "../../assets/images/service1.png";
import image2 from "../../assets/images/service2.png";
import image3 from "../../assets/images/service3.png";
import image4 from "../../assets/images/work2.png";
import { useRef } from "react";
import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { gsap, SplitText, useGSAP, CustomEase } from "../../lib/gsap";
import RubberyString from "./RubberyString";

CustomEase.create("paragraphEase", "0,0,0,1");
CustomEase.create("serviceEase", "0.5, 0, 0, 1");

const Services = () => {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

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
            yPercent: 136,
            rotation: 2.7,
            opacity: 0.38,
            transformOrigin: "50% 50%",
            ease: "paragraphEase",
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

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const services = gsap.utils.toArray<HTMLDivElement>(
          ".service",
          sectionRef.current,
        );

        const tl = gsap.timeline({
          defaults: { duration: 1.2, ease: "serviceEase" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            // markers: true,
          },
        });

        tl.fromTo(
          services,
          {
            rotation: 2,
          },
          { rotation: 0 },
          0,
        )
          .fromTo(services, { opacity: 0 }, { opacity: 1, ease: "none" }, 0)
          .fromTo(
            services,
            { "--service-underline": 0 },
            { "--service-underline": 1, stagger: 0.2 },
            0,
          );
      });

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const buttons = gsap.utils.toArray<HTMLElement>(".service-button");
        const links = gsap.utils.toArray<HTMLElement>(".service-link");

        const cleanups = buttons.map((btn) => {
          const bg = btn.querySelector(".service-bg");
          gsap.set(bg, { yPercent: 100 });

          const side = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            return e.clientY < r.top + r.height / 2 ? -1 : 1;
          };

          const enter = (e: MouseEvent) => {
            if (!gsap.isTweening(bg)) gsap.set(bg, { yPercent: side(e) * 100 });
            gsap.to(bg, {
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              overwrite: true,
            });
          };

          const leave = (e: MouseEvent) => {
            gsap.to(bg, {
              yPercent: side(e) * 100,
              duration: 0.6,
              ease: "power3.out",
              overwrite: true,
            });
          };

          btn.addEventListener("mouseenter", enter);
          btn.addEventListener("mouseleave", leave);
          return () => {
            btn.removeEventListener("mouseenter", enter);
            btn.removeEventListener("mouseleave", leave);
          };
        });

        const linkCleanUps = links.map((link) => {
          const texts = link.querySelectorAll(".service-link-text > span");
          const arrows = link.querySelectorAll(
            ".service-link-icon-wrapper svg",
          );

          const enter = () => {
            gsap.to(texts, {
              yPercent: -100,
              duration: 0.6,
              ease: "serviceEase",
              overwrite: true,
            });
            gsap.to(arrows, {
              xPercent: 100,
              duration: 0.6,
              ease: "serviceEase",
              overwrite: true,
            });
          };

          const leave = () => {
            gsap.to(texts, {
              yPercent: 0,
              duration: 0.6,
              ease: "serviceEase",
              overwrite: true,
            });

            gsap.to(arrows, {
              xPercent: 0,
              duration: 0.6,
              ease: "serviceEase",
              overwrite: true,
            });
          };

          link.addEventListener("mouseenter", enter);
          link.addEventListener("mouseleave", leave);

          return () => {
            link.removeEventListener("mouseenter", enter);
            link.removeEventListener("mouseleave", leave);
          };
        });

        return () => {
          cleanups.forEach((fn) => fn());
          linkCleanUps.forEach((fn) => fn());
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const services = [
    {
      serial: "(01)",
      title: "brand identity",
      description:
        "Logos, systems, and visual language that actually gets used.",
      image: image1,
    },
    {
      serial: "(02)",
      title: "web design & development",
      description: "Sites built to convert, not just look nice in a portfolio.",
      image: image2,
    },
    {
      serial: "(03)",
      title: "3D & motion design",
      description: "Depth and movement that make static screens feel alive.",
      image: image3,
    },
    {
      serial: "(04)",
      title: "content & art direction",
      description:
        "Photography, illustration, and art direction that ties it all together.",
      image: image4,
    },
  ];
  return (
    <section className="service-section" ref={sectionRef}>
      <p className="headline" ref={paraRef}>
        <span className="indentation" aria-hidden="true" />
        One studio handles every discipline your project needs, carrying it from
        first sketch all the way to a shipped product without passing you
        between vendors along the way.
      </p>

      <ul className="services">
        {services.map((item, i) => {
          const open = active === i;
          return (
            <li className="service" key={i} data-open={open}>
              <button
                onClick={() => setActive(open ? null : i)}
                className="service-button"
                aria-expanded={open}
              >
                <span className="service-bg" aria-hidden="true" />
                <span className="service-serial">{item.serial}</span>
                <span className="service-title">{item.title}</span>
                <span className="service-icon">
                  <Plus strokeWidth={2} />
                </span>
              </button>

              <div className="info-container">
                <div className="info-clip">
                  <div className="wrapper">
                    <div className="content">
                      <p className="service-description">{item.description}</p>

                      <a href="#" className="service-link">
                        <div className="service-link-text">
                          <span>Get started</span>
                          <span>Get started</span>
                        </div>
                        <span className="service-link-icon">
                          <span className="service-link-icon-wrapper">
                            <ArrowRight color="#E0DDCF" strokeWidth={2} />
                            <ArrowRight color="#E0DDCF" strokeWidth={2} />
                          </span>
                        </span>
                      </a>
                    </div>
                    <div className="service-image">
                      <div className="service-image-wrapper">
                        <img src={item.image} alt={item.description} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* lines  */}
      <div className="strings">
        <RubberyString opacity={0.3} />
        <RubberyString opacity={0.6} />
        <RubberyString opacity={0.9} />
      </div>
    </section>
  );
};

export default Services;
