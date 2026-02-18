"use client";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/features/global/components/button/button";
import type { StepNavigationProps } from "@/features/global/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shadcn/components/ui/tooltip";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * StepNavigation - back/next navigation buttons for the stepper
 *
 * Handles navigation state, disabled states, and completion
 */
export function StepNavigation({
  currentStep,
  onBack,
  onNext,
  onComplete,
  canGoBack,
  canGoNext,
  isLastStep,
  isSubmitting,
  config = {},
  className,
}: StepNavigationProps) {
  const {
    backButtonText = "Anterior",
    nextButtonText = "Continuar",
    completeButtonText = "Completar",
    showBackOnFirstStep = true,
    exitFlowTooltip = "Volver",
    backButtonProps = {},
    nextButtonProps = {},
  } = config;

  const isFirstStep = currentStep === 1;
  const showBackButton = showBackOnFirstStep || !isFirstStep;

  return (
    <div className={cn("step-navigation pb-2", className)}>
      {/* Back button */}
      {showBackButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onBack}
              disabled={!canGoBack || isSubmitting}
              {...backButtonProps}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButtonText}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFirstStep ? exitFlowTooltip : "Volver al paso anterior"}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Spacer when back button is hidden */}
      {!showBackButton && <div />}

      {/* Next/Complete button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            onClick={isLastStep ? onComplete : onNext}
            disabled={!canGoNext || isSubmitting}
            {...nextButtonProps}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : isLastStep ? (
              <>
                {completeButtonText}
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                {nextButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!canGoNext
            ? "Completa los campos requeridos"
            : isLastStep
              ? "Finalizar"
              : "Continuar al siguiente paso"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
