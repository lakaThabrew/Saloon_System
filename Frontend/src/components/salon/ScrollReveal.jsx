import { useEffect, useRef, useState } from "react";

/**
 * Intersection Observer wrapper for scroll-triggered reveal animations.
 *
 * Variants: "up" (default) | "scale" | "left" | "right"
 * The matching CSS classes (.reveal, .reveal-scale, .reveal-left, .reveal-right)
 * live in styles.css and toggle the .revealed class when visible.
 */
export function ScrollReveal({
  children,
  variant = "up",
  delay = 0,
  threshold = 0.15,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const variantClass = {
    up: "reveal",
    scale: "reveal-scale",
    left: "reveal-left",
    right: "reveal-right",
  }[variant];

  return (
    <Tag
      ref={ref}
      className={`${variantClass}${revealed ? " revealed" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
