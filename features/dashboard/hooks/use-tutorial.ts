'use client';

import { useState, useEffect, useCallback } from 'react';

import type { TutorialState } from '@/features/dashboard/types';
import { getTutorialState, markTutorialCompleted, updateTutorialStep } from '@/features/dashboard/utils';

export const useTutorial = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if tutorial should be shown on mount
  useEffect(() => {
    const checkTutorialStatus = () => {
      try {
        const state = getTutorialState();
        if (state) {
          setTutorialState(state);
          // Show dialog if tutorial is not completed (first time user)
          if (!state.isCompleted) {
            setIsDialogOpen(true);
          }
        } else {
          // First time user, initialize state
          const initialState: TutorialState = {
            isCompleted: false,
            currentStep: 0,
            completedSteps: [],
          };
          setTutorialState(initialState);
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

  // Calculate progress based on current step
  const getProgress = useCallback(() => {
    if (!tutorialState) return 0;
    const totalSteps = 4; // welcome, overview, navigation, completion
    return Math.round((tutorialState.currentStep / (totalSteps - 1)) * 100);
  }, [tutorialState]);

  // Get completed steps based on current step
  const getCompletedSteps = useCallback(() => {
    if (!tutorialState) return [];
    const stepIds = ['welcome', 'dashboard-overview', 'navigation', 'completion'];
    return stepIds.slice(0, tutorialState.currentStep + 1);
  }, [tutorialState]);

  return {
    isDialogOpen,
    tutorialState,
    isLoading,
    openTutorial,
    closeTutorial,
    handleTutorialComplete,
    handleTutorialStepChange,
    getProgress,
    getCompletedSteps,
  };
};
