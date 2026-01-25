"use client";

import { Children, useState, useCallback, Fragment } from "react";

import { ScrollArea } from "@/features/shadcn/components/scroll-area";
import { Separator } from "@/features/shadcn/components/ui/separator";
import type { StepperProps, StepStatus } from "@/features/global/types";
import { cn } from "@/features/shadcn/utils/cn";

import { StepContentWrapper } from "./step-content-wrapper";
import { StepIndicator } from "./step-indicator";
import { StepConnector } from "./step-connector";
import { StepNavigation } from "./step-navigation";
import "./stepper.css";

/**
 * Stepper - main orchestrator component for multi-step forms
 *
 * Fully controlled component that manages step navigation,
 * indicators, animations, and navigation buttons.
 *
 * @example
 * const [step, setStep] = useState(1);
 * const [validation, setValidation] = useState({});
 *
 * <Stepper
 *   currentStep={step}
 *   onStepChange={setStep}
 *   stepValidation={validation}
 *   steps={[
 *     { id: "info", label: "Basic Info" },
 *     { id: "media", label: "Media" },
 *   ]}
 * >
 *   <Step>Step 1 content</Step>
 *   <Step>Step 2 content</Step>
 * </Stepper>
 */
export function Stepper({
  children,
  currentStep,
  onStepChange,
  onFinalStepCompleted,
  onExitFlow,
  steps,
  orientation = "horizontal",
  showIndicators = true,
  showConnectors = true,
  showNavigation = true,
  renderStepIndicator,
  allowStepClick = false,
  stepValidation = {},
  classNames = {},
  navigationConfig = {},
  disableAnimations = false,
  className,
  ...rest
}: StepperProps) {
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  /**
   * Get the status of a step based on its position and validation
   */
  const getStepStatus = useCallback(
    (stepNumber: number): StepStatus => {
      if (stepValidation[stepNumber] === false) return "error";
      if (stepNumber === currentStep) return "active";
      if (stepNumber < currentStep) return "complete";
      return "inactive";
    },
    [currentStep, stepValidation]
  );

  /**
   * Handle clicking on a step indicator
   */
  const handleStepClick = useCallback(
    (clickedStep: number) => {
      if (!allowStepClick) return;
      // Only allow clicking on completed steps or current step
      if (clickedStep <= currentStep) {
        setDirection(clickedStep > currentStep ? -1 : 1);
        onStepChange?.(clickedStep);
      }
    },
    [allowStepClick, currentStep, onStepChange]
  );

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(1);
      onStepChange?.(currentStep - 1);
    } else if (onExitFlow) {
      onExitFlow();
    }
  }, [currentStep, onStepChange, onExitFlow]);

  /**
   * Handle next navigation
   */
  const handleNext = useCallback(() => {
    if (!isLastStep && stepValidation[currentStep] !== false) {
      setDirection(-1);
      onStepChange?.(currentStep + 1);
    }
  }, [isLastStep, currentStep, stepValidation, onStepChange]);

  /**
   * Handle form completion
   */
  const handleComplete = useCallback(() => {
    if (stepValidation[currentStep] !== false) {
      setDirection(-1);
      onFinalStepCompleted?.();
    }
  }, [currentStep, stepValidation, onFinalStepCompleted]);

  /**
   * Render step indicators with optional connectors
   */
  const renderIndicators = () => (
    <div
      className={cn(
        "step-indicator-row",
        orientation === "vertical" && "vertical",
        classNames.indicatorContainer
      )}
    >
      {stepsArray.map((_, index) => {
        const stepNumber = index + 1;
        const status = getStepStatus(stepNumber);
        const config = steps?.[index];
        const isNotLastStep = index < totalSteps - 1;

        return (
          <Fragment key={stepNumber}>
            {renderStepIndicator ? (
              renderStepIndicator({
                step: stepNumber,
                currentStep,
                status,
                config,
                onStepClick: handleStepClick,
                disabled: !allowStepClick || stepNumber > currentStep,
              })
            ) : (
              <StepIndicator
                step={stepNumber}
                currentStep={currentStep}
                status={status}
                config={config}
                onClickStep={allowStepClick ? handleStepClick : undefined}
                disabled={!allowStepClick || stepNumber > currentStep}
                className={classNames.indicator}
              />
            )}
            {showConnectors && isNotLastStep && (
              <StepConnector
                isComplete={stepNumber < currentStep}
                orientation={orientation}
                className={classNames.connector}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );

  return (
    <div className={cn("stepper-root", classNames.root, className)} {...rest}>
      {/* Step indicators - mobile (top) */}
      {showIndicators && (
        <div className="step-circle-container md:hidden">
          {renderIndicators()}
        </div>
      )}

      {/* Step content */}
      <StepContentWrapper
        isCompleted={isCompleted}
        currentStep={currentStep}
        direction={direction}
        className={classNames.content}
        disableAnimations={disableAnimations}
      >
        <ScrollArea className="h-full max-h-[calc(100dvh-16rem)] md:max-h-[500px] w-full">
          {stepsArray[currentStep - 1]}
        </ScrollArea>
      </StepContentWrapper>

      {/* Navigation section */}
      {!isCompleted && showNavigation && (
        <>
          <Separator />
          <div className="flex items-center justify-between gap-4 px-1">
            {/* Back button (left) */}
            <StepNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={handleBack}
              onNext={handleNext}
              onComplete={handleComplete}
              canGoBack={currentStep > 1 || !!onExitFlow}
              canGoNext={stepValidation[currentStep] !== false}
              isLastStep={isLastStep}
              config={navigationConfig}
              className={cn("flex-1", classNames.navigation)}
            />

            {/* Step indicators - desktop (center) */}
            {showIndicators && (
              <div className="step-circle-container hidden md:block flex-shrink-0">
                {renderIndicators()}
              </div>
            )}

            {/* Spacer for balance on desktop */}
            <div className="hidden md:block flex-1" />
          </div>
        </>
      )}
    </div>
  );
}
