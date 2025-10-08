'use client';

import { Store, Settings, Check, Box } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { TutorialStepper } from '@/features/dashboard/components';
import type { TutorialDialogProps, TutorialStep } from '@/features/dashboard/types';

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
    id: 'newStore',
    title: t('newStore'),
    description: t('newStoreDescription'),
    content: (
      <div className="space-y-4 flex flex-col items-center justify-center grow">
        <div className='grid md:grid-cols-[auto_1fr] gap-4'>
          <Store className='size-24 text-muted-foreground' />
          <div className='flex flex-col gap-4'>
            <p className='text-muted-foreground'>Tu tienda es el lugar donde todo comienza. Aquí podrás crear tus productos, gestionar tus ventas y mucho más.</p>
            <Button>
              {t('newStoreCTA')}
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'newProduct',
    title: t('newProduct'),
    description: t('newProductDescription'),
    content: (
      <div className="space-y-4 flex flex-col items-center justify-center grow">
        <div className='grid md:grid-cols-[auto_1fr] gap-4'>
          <Box className='size-24 text-muted-foreground' />
          <div className='flex flex-col gap-4'>
            <p className='text-muted-foreground'>Tu producto es el elemento que vas a vender asi que asegurate de tomarte el tiempo para configurarlo correctamente.</p>
            <Button size="lg">
              {t('newProductCTA')}
            </Button>
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
          <DialogDescription>
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
          <div className="grow flex flex-col py-20">
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
