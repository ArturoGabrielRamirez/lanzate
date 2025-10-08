'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, Store, BarChart3, Settings, Check } from 'lucide-react';
import { TutorialStepper } from './tutorial-stepper';
import type { TutorialDialogProps, TutorialStep } from '../types';
import { Progress } from '@/components/ui/progress';

const getTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    id: 'welcome',
    title: t('welcome'),
    description: t('welcomeDescription'),
    content: (
      <div className="space-y-4 text-center flex flex-col items-center justify-center grow">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          {t('welcomeContent')}
        </p>
      </div>
    ),
  },
  {
    id: 'dashboard-overview',
    title: t('overview'),
    description: t('overviewDescription'),
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold">Analytics</h4>
            <p className="text-sm text-muted-foreground">Métricas y estadísticas</p>
          </div>
          <div className="p-4 border rounded-lg">
            <Store className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-semibold">Tiendas</h4>
            <p className="text-sm text-muted-foreground">Gestiona tus tiendas</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'navigation',
    title: t('navigation'),
    description: t('navigationDescription'),
    content: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 border rounded-lg">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-semibold">Gestión de Usuarios</h4>
            <p className="text-sm text-muted-foreground">Administra usuarios y permisos</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 border rounded-lg">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-semibold">Configuración</h4>
            <p className="text-sm text-muted-foreground">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'completion',
    title: t('completion'),
    description: t('completionDescription'),
    content: (
      <div className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-muted-foreground">
          {t('completionContent')}
        </p>
      </div>
    ),
  },
];

export const TutorialDialog = ({ isOpen, onOpenChange, onComplete }: TutorialDialogProps) => {
  const t = useTranslations('dashboard.tutorial');
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = getTutorialSteps(t);
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-lg:h-[calc(100vh_-_2rem)] w-[calc(100vw_-_2rem)] max-lg:!max-w-full !grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription className="mt-2">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col'>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('stepper.step')} {currentStep + 1} {t('stepper.of')} {tutorialSteps.length}</span>
              <span>{Math.round(progress)}% {t('stepper.completed')}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="grow flex flex-col">
            {currentStepData.content}
          </div>
        </div>


        <DialogFooter className='!justify-between w-full flex-row items-center'>
          <TutorialStepper
            steps={tutorialSteps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
            onNext={handleNext}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
