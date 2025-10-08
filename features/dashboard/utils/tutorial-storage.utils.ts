import type { TutorialState } from '@/features/dashboard/types';

const TUTORIAL_STORAGE_KEY = 'lanzate_tutorial_state';

/**
 * Gets the tutorial state from localStorage
 * @returns TutorialState or null if not found
 */
export function getTutorialState(): TutorialState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading tutorial state from localStorage:', error);
    return null;
  }
}

/**
 * Saves the tutorial state to localStorage
 * @param state - The tutorial state to save
 */
export function saveTutorialState(state: TutorialState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving tutorial state to localStorage:', error);
  }
}

/**
 * Marks the tutorial as completed
 */
export function markTutorialCompleted(): void {
  const newState: TutorialState = {
    isCompleted: true,
    currentStep: 0,
    completedSteps: [],
    lastCompletedAt: new Date().toISOString(),
  };

  saveTutorialState(newState);
}

/**
 * Updates the current step in the tutorial
 * @param step - The step number (0-based)
 */
export function updateTutorialStep(step: number): void {
  const currentState = getTutorialState();
  const newState: TutorialState = {
    isCompleted: false,
    currentStep: step,
    completedSteps: currentState?.completedSteps || [],
    lastCompletedAt: currentState?.lastCompletedAt,
  };

  saveTutorialState(newState);
}

/**
 * Checks if the tutorial has been completed
 * @returns boolean indicating if tutorial is completed
 */
export function isTutorialCompleted(): boolean {
  const state = getTutorialState();
  return state?.isCompleted || false;
}

/**
 * Resets the tutorial state (for testing purposes)
 */
export function resetTutorialState(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting tutorial state:', error);
  }
}
