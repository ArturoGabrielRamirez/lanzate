'use client';

import { TutorialDialog } from './tutorial-dialog';
import { TutorialWidget } from './tutorial-widget';
import { useTutorial } from '../hooks';

export const DashboardTutorial = () => {
  const {
    isDialogOpen,
    tutorialState,
    isLoading,
    openTutorial,
    closeTutorial,
    handleTutorialComplete,
  } = useTutorial();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <TutorialDialog
        isOpen={isDialogOpen}
        onOpenChange={closeTutorial}
        onComplete={handleTutorialComplete}
      />

      <TutorialWidget
        onOpenTutorial={openTutorial}
        className="mb-6"
      />
    </>
  );
};
