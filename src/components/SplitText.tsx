import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: { opacity: number; y: number };
  to?: { opacity: number; y: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: string;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const splitInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    const el = ref.current;
    animationCompletedRef.current = false;

    // Clean up previous split
    if (splitInstance.current) {
      splitInstance.current.revert();
      splitInstance.current = null;
    }

    // Map splitType to SplitType's types
    let types: ("chars" | "words" | "lines")[] = [];
    if (splitType === "lines") types = ["lines"];
    else if (splitType === "words") types = ["words"];
    else if (splitType === "chars") types = ["chars"];
    else types = ["chars"];

    // Debug: log before splitting
    console.log("[SplitText] effect running", { el, text, innerHTML: el.innerHTML, textContent: el.textContent });

    setTimeout(() => {
      // Debug: log after timeout
      console.log("[SplitText] splitting", { el, innerHTML: el.innerHTML, textContent: el.textContent });
      splitInstance.current = new SplitType(el, {
        types,
        tagName: "span",
      });

      let targets: HTMLElement[] = [];
      if (splitType === "lines") targets = splitInstance.current.lines;
      else if (splitType === "words") targets = splitInstance.current.words;
      else if (splitType === "chars") targets = splitInstance.current.chars;
      else targets = splitInstance.current.chars;

      // Debug: log targets
      console.log("[SplitText] targets", { targets, splitInstance: splitInstance.current });

      if (!targets || targets.length === 0) {
        console.warn("[SplitText] No targets found for SplitText animation", { el, splitInstance: splitInstance.current });
        splitInstance.current.revert();
        return;
      }

      targets.forEach((t: any) => {
        t.style.willChange = "transform, opacity";
      });

      // Animate with GSAP
      const tl = gsap.timeline({
        smoothChildTiming: true,
        onComplete: () => {
          animationCompletedRef.current = true;
          gsap.set(targets, {
            ...to,
            clearProps: "willChange",
            immediateRender: true,
          });
          onLetterAnimationComplete?.();
        },
      });

      tl.set(targets, { ...from, immediateRender: false, force3D: true });
      tl.to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
      });

      // Cleanup
      return () => {
        tl.kill();
        gsap.killTweensOf(targets);
        if (splitInstance.current) {
          splitInstance.current.revert();
          splitInstance.current = null;
        }
      };
    }, 0);
    // eslint-disable-next-line
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign: textAlign as any,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText; 