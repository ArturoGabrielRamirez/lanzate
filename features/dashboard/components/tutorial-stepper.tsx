'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import type { TutorialStepperProps } from '@/features/dashboard/types';

export const TutorialStepper = ({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  onNext,
}: TutorialStepperProps) => {

  const t = useTranslations('dashboard.tutorial');
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
    <>
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('stepper.previous')}
      </Button>

      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${index <= currentStep
              ? 'bg-primary'
              : 'bg-muted'
              }`}
          />
        ))}
      </div>

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
    </>
  );
};
