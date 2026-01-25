"use client";

import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

import type { StepContentWrapperProps } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

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
  }),
};

/**
 * Props for SlideTransition internal component
 */
interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
  disableAnimations?: boolean;
}

/**
 * SlideTransition - handles individual step slide animations
 */
function SlideTransition({
  children,
  direction,
  onHeightReady,
  disableAnimations,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      onHeightReady(element.offsetHeight);
    });

    resizeObserver.observe(element);

    // Initial measurement
    onHeightReady(element.offsetHeight);

    return () => resizeObserver.disconnect();
  }, [onHeightReady]);

  if (disableAnimations) {
    return (
      <div ref={containerRef} style={{ position: "relative" }}>
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
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StepContentWrapper - animated container for step content
 *
 * Handles height transitions and slide animations between steps
 */
export function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
  disableAnimations,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  if (disableAnimations) {
    return (
      <div className={cn("step-content-wrapper", className)}>
        {!isCompleted && children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("step-content-wrapper", className)}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.3 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
            disableAnimations={disableAnimations}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
