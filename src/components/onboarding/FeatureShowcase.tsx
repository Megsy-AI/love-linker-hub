import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPayRegionOrGuess, setPayRegion, type PayRegion } from "@/lib/payRegion";
import { setUserLang } from "@/lib/authI18n";
import "@/styles/welcome-showcase.css";

const AUTH_HERO_POSTER = "/route-assets/auth/auth-hero-v6-poster.jpg";

type Direction = "next" | "prev";

/** Index of the last onboarding slide (the free-trial offer). */
const LAST = 3;

const STAGE_WIDE_POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp";
const STAGE_WIDE_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4";
const STAGE_NARROW_POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp";
const STAGE_NARROW_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4";

type Slide = {
  lineOne: string;
  dotWord: string;
  lineTwo?: string;
  intro: string;
  card: {
    variant: "speed" | "context" | "connections" | "trial";
    title: string;
    value: string;
    unit: string;
    caption: string;
  };
};

const SLIDES: Slide[] = [
  {
    lineOne: "Ask once.",
    dotWord: "Done",
    intro:
      "Megsy researches, checks the facts, and turns your request into a finished report, plan, presentation, or completed task.",
    card: {
      variant: "speed",
      title: "Every top model\nOne conversation",
      value: "40",
      unit: "+",
      caption: "Models working\nfor you",
    },
  },
  {
    lineOne: "One idea.",
    dotWord: "Every",
    lineTwo: "format.",
    intro:
      "Create images, videos, presentations, websites, and working apps — from the same conversation.",
    card: {
      variant: "context",
      title: "Context Window\nLong-form understanding",
      value: "2.4",
      unit: "M",
      caption: "Tokens processed\nsimultaneously",
    },
  },
  {
    lineOne: "Unlock",
    dotWord: "more",
    intro:
      "More powerful models, longer tasks, and bigger creations with Megsy Pro.",
    card: {
      variant: "connections",
      title: "Intelligent Connections\nCross-source context",
      value: "16",
      unit: "K",
      caption: "Connected data\nsources",
    },
  },
  {
    lineOne: "3 days for",
    dotWord: "$1",
    intro:
      "Get 3 premium images every day during your trial. Then continue for $7 in your first month with unlimited premium images, or cancel anytime.",
    card: {
      variant: "trial",
      title: "Megsy Pro\nIntroductory trial",
      value: "$1",
      unit: "/ 3 days",
      caption: "Then $7 your first\nmonth — cancel anytime",
    },
  },
];

export default function FeatureShowcase({
  onFinish,
}: {
  onFinish?: (target?: "trial") => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const touch = useRef({ x: 0, y: 0 });
  const [region] = useState<PayRegion>(() => getPayRegionOrGuess());
  const isTrial = index === LAST;
  const slide = SLIDES[index];

  useEffect(() => {
    setPayRegion(region);
    // The welcome showcase is always shown in English, regardless of region.
    void setUserLang("en", { syncRemote: false });
  }, [region]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyColor = document.body.style.backgroundColor;
    const previousHtmlColor = document.documentElement.style.backgroundColor;
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#ececeb";
    document.documentElement.style.backgroundColor = "#ececeb";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.backgroundColor = previousBodyColor;
      document.documentElement.style.backgroundColor = previousHtmlColor;
    };
  }, []);

  const goTo = useCallback((target: number) => {
    setIndex((current) => {
      const nextIndex = Math.max(0, Math.min(LAST, target));
      if (nextIndex === current) return current;
      setDirection(nextIndex > current ? "next" : "prev");
      return nextIndex;
    });
  }, []);

  // Slide 2 pre-warms the sign-up screen: its code chunk and poster image only.
  useEffect(() => {
    if (index !== 1) return;
    void import("@/pages/auth/AuthPage").catch(() => {});
    const poster = new Image();
    poster.src = AUTH_HERO_POSTER;
  }, [index]);

  // Horizontal scroll (trackpad / mouse wheel) moves between slides.
  useEffect(() => {
    let locked = false;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < 24 || Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (locked) return;
      locked = true;
      window.setTimeout(() => {
        locked = false;
      }, 450);
      goTo(index + (event.deltaX > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo, index]);

  const continueFlow = () => {
    if (isTrial) {
      onFinish?.("trial");
      return;
    }
    goTo(index + 1);
  };

  const finishWithoutOffer = () => onFinish?.();

  const onTouchStart = (event: React.TouchEvent) => {
    touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const dx = event.changedTouches[0].clientX - touch.current.x;
    const dy = event.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx < 0 ? index + 1 : index - 1);
  };

  return (
    <main
      dir="ltr"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="wstage fixed inset-0 isolate h-[100dvh] w-full overflow-hidden"
    >
      <StageMotion />
      <div className="wstage__scrim" />

      <h1 className="sr-only">Welcome to Megsy</h1>

      <section
        key={index}
        aria-live="polite"
        className={`relative z-10 flex h-full flex-col px-[var(--gutter)] pb-44 pt-[max(28px,7vh)] ${
          direction === "next" ? "welcome-screen-enter-next" : "welcome-screen-enter-prev"
        }`}
      >
        <div className="mx-auto w-full max-w-md sm:max-w-lg">
          <p className="wstage__headline">
            <span className="wstage__line">
              {slide.lineOne}
              {!slide.lineTwo && <DotWord text={slide.dotWord} />}
            </span>
            {slide.lineTwo ? (
              <span className="wstage__line">
                <DotWord text={slide.dotWord} />
                <span className="ml-[.22em]">{slide.lineTwo}</span>
              </span>
            ) : null}
          </p>
          <p className="wstage__intro">{slide.intro}</p>
        </div>

        <div className="mx-auto mt-[clamp(18px,4vh,42px)] flex min-h-0 w-full max-w-md flex-1 items-start justify-center sm:max-w-lg">
          <MetricCard card={slide.card} />
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 z-20 px-[var(--gutter)] pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 sm:mx-auto sm:max-w-md">
        <div className="mb-3 flex justify-center gap-2" aria-label={`Step ${index + 1} of 4`}>
          {[0, 1, 2, 3].map((step) => (
            <Button
              key={step}
              type="button"
              variant="ghost"
              data-plain
              aria-label={`Go to step ${step + 1}`}
              aria-current={step === index ? "step" : undefined}
              onClick={() => goTo(step)}
              className="grid h-6 w-7 min-w-0 place-items-center p-0 hover:bg-transparent"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  step === index ? "w-7 bg-[#222]" : "w-1.5 bg-[rgba(34,34,34,.2)]"
                }`}
              />
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          data-plain
          onClick={continueFlow}
          className="h-14 w-full rounded-full bg-[#222] text-base font-semibold !text-[#ececeb] shadow-[0_8px_24px_rgba(34,34,34,.22)] hover:bg-[#2f2f2f]"
        >
          {isTrial ? "Start 3 days for $1" : "Continue"}
          {!isTrial && <ArrowRight className="size-5" />}
        </Button>

        {isTrial && (
          <Button
            type="button"
            variant="ghost"
            data-plain
            onClick={finishWithoutOffer}
            className="mt-2 h-10 w-full rounded-full text-sm font-semibold text-[#4a4a4a] hover:bg-transparent"
          >
            Maybe later
          </Button>
        )}
      </div>
    </main>
  );
}

function StageMotion() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return (
    <video
      key={wide ? "wide" : "narrow"}
      className="wstage__motion"
      autoPlay
      muted
      loop
      playsInline
      preload={wide ? "auto" : "none"}
      aria-hidden="true"
      poster={wide ? STAGE_WIDE_POSTER : STAGE_NARROW_POSTER}
      src={wide ? STAGE_WIDE_SRC : STAGE_NARROW_SRC}
    />
  );
}

/** Word rendered as an LED dot-matrix fill. */
function DotWord({ text }: { text: string }) {
  const raw = useId();
  const id = `dw${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const width = Math.max(1, text.length) * 58;
  return (
    <span className="dot-word" aria-label={text} role="img">
      <svg viewBox={`0 0 ${width} 120`} aria-hidden="true">
        <defs>
          <pattern id={id} width="12.6" height="12.6" patternUnits="userSpaceOnUse">
            <circle cx="6.3" cy="6.3" r="4.5" fill="currentColor" />
          </pattern>
        </defs>
        <text
          x="0"
          y="94"
          fontFamily='Inter, -apple-system, "Segoe UI", sans-serif'
          fontWeight="600"
          fontSize="100"
          letterSpacing="-2"
          fill={`url(#${id})`}
        >
          {text}
        </text>
      </svg>
    </span>
  );
}

function MetricCard({ card }: { card: Slide["card"] }) {
  const raw = useId();
  const noiseId = `n${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <article className={`wcard wcard--${card.variant}`}>
      <svg className="wcard__grain" viewBox="0 0 429 554" aria-hidden="true" preserveAspectRatio="none">
        <filter id={noiseId}>
          <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="27" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.8" intercept="-.25" />
            <feFuncG type="linear" slope="1.8" intercept="-.25" />
            <feFuncB type="linear" slope="1.8" intercept="-.25" />
            <feFuncA type="table" tableValues="0 .52" />
          </feComponentTransfer>
        </filter>
        <rect width="429" height="554" filter={`url(#${noiseId})`} />
      </svg>

      <div className="wcard__body">
        <h2 className="wcard__title whitespace-pre-line">{card.title}</h2>
        <div>
          <div className="wcard__metric">
            <span className="wcard__value">{card.value}</span>
            <span className="wcard__unit">{card.unit}</span>
          </div>
          <p className="wcard__caption whitespace-pre-line">{card.caption}</p>
        </div>
      </div>
    </article>
  );
}
