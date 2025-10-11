'use client';

import { TutorialDialog, TutorialWidget } from '@/features/dashboard/components';
import { useTutorial } from '@/features/dashboard/hooks';

function DashboardTutorial() {
  const {
    isDialogOpen,
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

export { DashboardTutorial };