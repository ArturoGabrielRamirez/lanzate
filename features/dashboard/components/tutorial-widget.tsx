'use client';

import { Play, CheckCircle, Circle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { useTutorial } from '@/features/dashboard/hooks';
import type { TutorialWidgetProps } from '@/features/dashboard/types';

const TUTORIAL_STEPS = [
  { id: 'welcome', title: 'Bienvenida' },
  { id: 'dashboard-overview', title: 'Vista General' },
  { id: 'navigation', title: 'Navegación' },
  { id: 'completion', title: 'Finalización' },
];

function TutorialWidget({ onOpenTutorial, className }: TutorialWidgetProps) {
  const t = useTranslations('dashboard.tutorial');
  const { tutorialState, getProgress, getCompletedSteps, isLoading } = useTutorial();

  if (isLoading || !tutorialState) {
    return null;
  }

  const completedSteps = getCompletedSteps();
  const totalSteps = TUTORIAL_STEPS.length;
  const progress = getProgress();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t('widget.title')}</CardTitle>
            <CardDescription>
              {t('widget.description')}
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="secondary" className="text-xs">
              {completedSteps}/{totalSteps}
            </Badge>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('widget.progress')}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {TUTORIAL_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <div key={step.id} className="flex items-center space-x-3">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onOpenTutorial}
          className="w-full"
          variant="outline"
        >
          <Play className="w-4 h-4 mr-2" />
          {tutorialState.isCompleted ? t('widget.repeat') : t('widget.continue')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { TutorialWidget };