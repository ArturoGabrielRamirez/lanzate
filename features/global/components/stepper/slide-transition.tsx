"use client";

import { motion, type Variants } from "motion/react";
import { useRef, useLayoutEffect, useEffect } from "react";

import type { SlideTransitionProps } from "@/features/global/types";

/**
 * Animation variants for step transitions
 */
const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
    position: "absolute" as const,
  }),
};

/**
 * SlideTransition - handles individual step slide animations
 *
 * Uses ResizeObserver to measure content height and
 * Framer Motion for smooth slide transitions.
 */
export function SlideTransition({
  children,
  direction,
  onHeightReady,
  disableAnimations,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use useEffect for client-side measurement
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      onHeightReady(element.offsetHeight);
    });

    resizeObserver.observe(element);

    // Initial measurement with a small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      if (element) {
        onHeightReady(element.offsetHeight);
      }
    }, 10);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [onHeightReady]);

  if (disableAnimations) {
    return (
      <div ref={containerRef} className="w-full">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
