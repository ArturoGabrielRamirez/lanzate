"use client";

import type { StepProps } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Step component - simple wrapper for step content
 *
 * @example
 * <Stepper currentStep={1} onStepChange={setStep}>
 *   <Step>Step 1 content</Step>
 *   <Step>Step 2 content</Step>
 * </Stepper>
 */
export function Step({ children, className }: StepProps) {
  return <div className={cn("step-content", className)}>{children}</div>;
}
