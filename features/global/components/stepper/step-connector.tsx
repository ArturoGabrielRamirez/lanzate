"use client";

import { motion, type Variants } from "motion/react";

import type { StepConnectorProps } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Animation variants for connector line
 */
const lineVariants: Variants = {
  incomplete: {
    width: 0,
    backgroundColor: "transparent",
  },
  complete: {
    width: "100%",
    backgroundColor: "hsl(var(--success, 142 76% 36%))",
  },
};

const verticalLineVariants: Variants = {
  incomplete: {
    height: 0,
    backgroundColor: "transparent",
  },
  complete: {
    height: "100%",
    backgroundColor: "hsl(var(--success, 142 76% 36%))",
  },
};

/**
 * StepConnector - animated line connecting step indicators
 *
 * Fills with color when the step before it is complete
 */
export function StepConnector({
  isComplete,
  orientation = "horizontal",
  className,
}: StepConnectorProps) {
  const isVertical = orientation === "vertical";
  const variants = isVertical ? verticalLineVariants : lineVariants;

  return (
    <div className={cn("step-connector", isVertical && "vertical", className)}>
      <motion.div
        className="step-connector-inner"
        variants={variants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
