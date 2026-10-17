import "./Hero.css";
import { useRef } from "react";
import { gsap, useGSAP, CustomEase } from "../../lib/gsap";
import heroVideo from "../../assets/videos/Hero-video-6.mp4";
import heroVideoMobile from "../../assets/videos/hero_video_mobile.mp4";
import heroPoster from "../../assets/images/hero-poster-2.jpg";

// main text svgs
import h from "../../../src/assets/svgs/H.svg";
import aFirst from "../../../src/assets/svgs/a.svg";
import l from "../../../src/assets/svgs/l.svg";
import i from "../../../src/assets/svgs/i.svg";
import dFirst from "../../../src/assets/svgs/d.svg";
import e from "../../../src/assets/svgs/e.svg";
import dSecond from "../../../src/assets/svgs/D-second.svg";
import g from "../../../src/assets/svgs/g.svg";
import t from "../../../src/assets/svgs/t.svg";
import aSecond from "../../../src/assets/svgs/a-second.svg";

CustomEase.create("heroReveal", "0.8, 0, 0.2, 1");
CustomEase.create("letterRise", "0, 0, 0, 1");

const CLIP_START = "inset(45.588% 23.333% round 4px)";
const CLIP_END = "inset(0% 0% round 0px)";

const TEXT_START = 1.41;
const LETTER_DURATION = 0.35;
const LABEL_DURATION = 0.4;

const HEADING_IMGS = [
  [
    { src: h, w: 9.506 },
    { src: aFirst, w: 9.709 },
    { src: l, w: 1.697 },
    { src: i, w: 1.697 },
    { src: dFirst, w: 8.691 },
    { src: e, w: 8.216 },
  ],
  [
    { src: dSecond, w: 9.981, className: "second-word" },
    { src: i, w: 1.697 },
    { src: g, className: "letter-g", w: 8.555 },
    { src: i, w: 1.697 },
    { src: t, w: 5.771 },
    { src: aSecond, w: 7.672 },
    { src: l, w: 1.697 },
  ],
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          // onStart: () => {
          //   videoRef.current?.play().catch(() => {});
          // },
        });

        tl.fromTo(
          ".hero-video",
          { clipPath: CLIP_START },
          { clipPath: CLIP_END, duration: 1.52, ease: "heroReveal" },
        ).to(".video-container", {
          "--overlay-opacity": 0.9,
          duration: 5,
          ease: "power1.inOut",
        });

        // letter animation
        tl.fromTo(
          ".letter-inner",
          { yPercent: 134 },
          {
            yPercent: 0,
            duration: LETTER_DURATION,
            ease: "letterRise",
            stagger: 0.03,
          },
          TEXT_START,
        );

        tl.fromTo(
          ".label-inner",
          { yPercent: 100 },
          { yPercent: 0, duration: LABEL_DURATION, ease: "letterRise" },
          TEXT_START,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-video", { clipPath: CLIP_END });
        videoRef.current?.play().catch(() => {});
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="video-container">
        <video
          ref={videoRef}
          className="hero-video"
          poster={heroPoster}
          // autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source
            media="(max-width: 639px)"
            src={heroVideoMobile}
            type="video/mp4"
          />
          <source media="(min-width:640px)" src={heroVideo} type="video/mp4" />
        </video>

        {/* <Noise /> */}

        <div className="agency">
          <span className="label">
            <span className="label-inner">creative agency</span>
          </span>
          <span className="label">
            <span className="label-inner">est 2020</span>
          </span>
        </div>
      </div>

      <h1 className="heading" aria-label="Halide Digital">
        <div className="text-images">
          {HEADING_IMGS.flat().map(({ src, className, w }, i) => (
            <span
              className={`letter${className ? ` ${className}` : ""}`}
              key={i}
              style={{ "--w": w } as React.CSSProperties}
            >
              <img
                src={src}
                alt=""
                className="letter-inner"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </h1>
    </section>
  );
};

export default Hero;
