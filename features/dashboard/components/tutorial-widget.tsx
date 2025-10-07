'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Circle } from 'lucide-react';
import type { TutorialWidgetProps } from '../types';

const TUTORIAL_STEPS = [
  { id: 'welcome', title: 'Bienvenida', completed: true },
  { id: 'dashboard-overview', title: 'Vista General', completed: true },
  { id: 'navigation', title: 'Navegación', completed: false },
  { id: 'completion', title: 'Finalización', completed: false },
];

export const TutorialWidget = ({ onOpenTutorial, className }: TutorialWidgetProps) => {
  const t = useTranslations('dashboard.tutorial');

  const completedSteps = TUTORIAL_STEPS.filter(step => step.completed).length;
  const totalSteps = TUTORIAL_STEPS.length;
  const progress = (completedSteps / totalSteps) * 100;

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
          {TUTORIAL_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              {step.completed ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={`text-sm ${step.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onOpenTutorial}
          className="w-full"
          variant="outline"
        >
          <Play className="w-4 h-4 mr-2" />
          {completedSteps === totalSteps ? t('widget.repeat') : t('widget.continue')}
        </Button>
      </CardFooter>
    </Card>
  );
};
