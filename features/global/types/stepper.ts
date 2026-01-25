import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * Step status states for visual representation
 */
export type StepStatus = "active" | "complete" | "inactive" | "error";

/**
 * Stepper orientation
 */
export type StepperOrientation = "horizontal" | "vertical";

/**
 * Step metadata for configuration
 */
export interface StepConfig {
  /** Unique identifier for the step */
  id: string;
  /** Display label for the step */
  label: string;
  /** Optional description shown below label */
  description?: string;
  /** Optional custom icon for the step indicator */
  icon?: ReactNode;
  /** Whether this step is optional (can be skipped) */
  optional?: boolean;
}

/**
 * Props for custom step indicator renderer
 */
export interface RenderStepIndicatorProps {
  /** Step number (1-indexed) */
  step: number;
  /** Current active step */
  currentStep: number;
  /** Calculated step status */
  status: StepStatus;
  /** Step configuration */
  config?: StepConfig;
  /** Click handler to navigate to this step */
  onStepClick: (step: number) => void;
  /** Whether clicking is disabled */
  disabled?: boolean;
}

/**
 * Class name customization for Stepper parts
 */
export interface StepperClassNames {
  root?: string;
  indicatorContainer?: string;
  indicator?: string;
  connector?: string;
  content?: string;
  navigation?: string;
}

/**
 * Navigation buttons customization
 */
export interface StepperNavigationConfig {
  backButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  showBackOnFirstStep?: boolean;
  exitFlowTooltip?: string;
}

/**
 * Main Stepper component props
 */
export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Step content as children (each child is a step) */
  children: ReactNode;
  /** Current active step (1-indexed), controlled externally */
  currentStep: number;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Callback when final step is completed */
  onFinalStepCompleted?: () => void;
  /** Callback when user exits the flow (back on first step) */
  onExitFlow?: () => void;
  /** Step configurations for labels, icons, etc. */
  steps?: StepConfig[];
  /** Orientation of the stepper */
  orientation?: StepperOrientation;
  /** Whether to show step indicators */
  showIndicators?: boolean;
  /** Whether to show connectors between steps */
  showConnectors?: boolean;
  /** Whether to show navigation buttons */
  showNavigation?: boolean;
  /** Custom step indicator renderer */
  renderStepIndicator?: (props: RenderStepIndicatorProps) => ReactNode;
  /** Whether clicking indicators navigates to that step */
  allowStepClick?: boolean;
  /** Validation state per step (for enabling/disabling navigation) */
  stepValidation?: Record<number, boolean>;
  /** Custom class names */
  classNames?: StepperClassNames;
  /** Navigation button customization */
  navigationConfig?: StepperNavigationConfig;
  /** Disable all animations */
  disableAnimations?: boolean;
}

/**
 * Props for Step component (content wrapper)
 */
export interface StepProps {
  children: ReactNode;
  className?: string;
}

/**
 * Props for StepIndicator component
 */
export interface StepIndicatorProps {
  step: number;
  currentStep: number;
  status: StepStatus;
  config?: StepConfig;
  onClickStep?: (step: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for StepConnector component
 */
export interface StepConnectorProps {
  isComplete: boolean;
  orientation?: StepperOrientation;
  className?: string;
}

/**
 * Props for StepContentWrapper (animated container)
 */
export interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
  disableAnimations?: boolean;
}

/**
 * Props for StepNavigation component
 */
export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  config?: StepperNavigationConfig;
  className?: string;
}

/**
 * Props for SlideTransition internal component
 */
export interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
  disableAnimations?: boolean;
}
