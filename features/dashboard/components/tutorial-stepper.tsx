'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { TutorialStepperProps } from '../types';
import { useTranslations } from 'next-intl';

export const TutorialStepper = ({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onNext,
}: TutorialStepperProps) => {
  const t = useTranslations('dashboard.tutorial');
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t('stepper.step')} {currentStep + 1} {t('stepper.of')} {steps.length}</span>
          <span>{Math.round(progress)}% {t('stepper.completed')}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index <= currentStep
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('stepper.previous')}
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4" />
              {t('stepper.finish')}
            </>
          ) : (
            <>
              {t('stepper.next')}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
