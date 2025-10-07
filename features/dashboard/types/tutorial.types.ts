import type { ReactNode } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
  isCompleted?: boolean;
}

export interface TutorialState {
  isCompleted: boolean;
  currentStep: number;
  completedSteps: string[];
  lastCompletedAt?: string;
}

export interface TutorialDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export interface TutorialWidgetProps {
  onOpenTutorial: () => void;
  className?: string;
}

export interface TutorialStepperProps {
  steps: TutorialStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void;
  onNext: () => void;
}
