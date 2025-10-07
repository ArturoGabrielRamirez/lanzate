'use client';

import { useState, useEffect, useCallback } from 'react';
import { isTutorialCompleted, markTutorialCompleted, updateTutorialStep } from '../utils';
import type { TutorialState } from '../types';

export const useTutorial = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if tutorial should be shown on mount
  useEffect(() => {
    const checkTutorialStatus = () => {
      try {
        const isCompleted = isTutorialCompleted();
        setTutorialState({
          isCompleted,
          currentStep: 0,
          completedSteps: [],
        });
        
        // Show dialog if tutorial is not completed (first time user)
        if (!isCompleted) {
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTutorialStatus();
  }, []);

  const handleTutorialComplete = useCallback(() => {
    try {
      markTutorialCompleted();
      setTutorialState(prev => prev ? { ...prev, isCompleted: true } : null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }
  }, []);

  const handleTutorialStepChange = useCallback((step: number) => {
    try {
      updateTutorialStep(step);
      setTutorialState(prev => prev ? { ...prev, currentStep: step } : null);
    } catch (error) {
      console.error('Error updating tutorial step:', error);
    }
  }, []);

  const openTutorial = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return {
    isDialogOpen,
    tutorialState,
    isLoading,
    openTutorial,
    closeTutorial,
    handleTutorialComplete,
    handleTutorialStepChange,
  };
};
