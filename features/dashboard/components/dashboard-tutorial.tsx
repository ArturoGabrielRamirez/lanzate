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
      {/* Tutorial Dialog */}
      <TutorialDialog
        isOpen={isDialogOpen}
        onOpenChange={closeTutorial}
        onComplete={handleTutorialComplete}
      />

      {/* Tutorial Widget - Only show if tutorial is not completed */}
      {!tutorialState?.isCompleted && (
        <TutorialWidget
          onOpenTutorial={openTutorial}
          className="mb-6"
        />
      )}
    </>
  );
};
