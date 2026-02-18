"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import type { StepContentWrapperProps } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

import { SlideTransition } from "./slide-transition";

/**
 * StepContentWrapper - animated container for step content
 *
 * Handles height transitions and slide animations between steps.
 * Uses AnimatePresence for enter/exit animations.
 */
export function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
  disableAnimations,
}: StepContentWrapperProps) {
  // Start with auto height until first measurement
  const [parentHeight, setParentHeight] = useState<number | "auto">("auto");

  if (disableAnimations) {
    return (
      <div className={cn("step-content-wrapper flex-1", className)}>
        {!isCompleted && children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("step-content-wrapper flex-1", className)}
      style={{ position: "relative", overflow: "hidden", minHeight: 200 }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
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
