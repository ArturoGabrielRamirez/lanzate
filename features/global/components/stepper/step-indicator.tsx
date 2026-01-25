"use client";

import { motion } from "motion/react";

import type { StepIndicatorProps, StepStatus } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Check icon SVG component with animated path
 */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.2 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/**
 * Get status from step comparison
 */
function getStepStatus(step: number, currentStep: number): StepStatus {
  if (step === currentStep) return "active";
  if (step < currentStep) return "complete";
  return "inactive";
}

/**
 * Animation variants for step indicator
 */
const indicatorVariants = {
  inactive: {
    scale: 1,
    backgroundColor: "hsl(var(--muted))",
    color: "hsl(var(--muted-foreground))",
  },
  active: {
    scale: 1,
    backgroundColor: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
  },
  complete: {
    scale: 1,
    backgroundColor: "hsl(var(--success, 142 76% 36%))",
    color: "hsl(var(--success-foreground, 0 0% 100%))",
  },
  error: {
    scale: 1,
    backgroundColor: "hsl(var(--destructive))",
    color: "hsl(var(--destructive-foreground))",
  },
};

/**
 * StepIndicator - visual indicator for a step's status
 *
 * Shows step number, active dot, or check icon based on status
 */
export function StepIndicator({
  step,
  currentStep,
  status: statusProp,
  config,
  onClickStep,
  disabled,
  className,
}: StepIndicatorProps) {
  // Use provided status or calculate from step position
  const status = statusProp ?? getStepStatus(step, currentStep);

  const handleClick = () => {
    if (!disabled && onClickStep && step !== currentStep) {
      onClickStep(step);
    }
  };

  const renderContent = () => {
    // If config has a custom icon, use it
    if (config?.icon) {
      return config.icon;
    }

    switch (status) {
      case "complete":
        return <CheckIcon className="check-icon" />;
      case "active":
        return <div className="active-dot" />;
      case "error":
        return <span className="step-number">!</span>;
      default:
        return <span className="step-number">{step}</span>;
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={cn(
        "step-indicator",
        disabled && "disabled",
        className
      )}
      animate={status}
      initial={false}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={config?.label ?? `Step ${step}`}
      aria-current={status === "active" ? "step" : undefined}
    >
      <motion.div
        variants={indicatorVariants}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
