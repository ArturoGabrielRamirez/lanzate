"use client";

import { Box, ImageIcon, Layers, Package, Settings } from "lucide-react";

import type { RenderStepIndicatorProps, StepConfig } from "@/features/global/types";

/**
 * Step configurations with icons and labels
 */
export const STEP_CONFIGS: StepConfig[] = [
  { id: "basic-info", label: "Info Básica", description: "Nombre y detalles" },
  { id: "media", label: "Imágenes", description: "Fotos del producto" },
  { id: "variants", label: "Variantes", description: "Opciones y precios" },
  { id: "type", label: "Tipo", description: "Físico o digital" },
  { id: "config", label: "Configuración", description: "Ajustes finales" },
];

/**
 * Icons for each step
 */
const STEP_ICONS = [Box, ImageIcon, Layers, Package, Settings];

/**
 * CustomStepIndicator - Custom step indicator with icons for product creation form
 *
 * Renders step indicators with appropriate icons and visual states.
 */
export function CustomStepIndicator({
  step,
  currentStep,
  onStepClick,
  disabled,
}: RenderStepIndicatorProps) {
  const Icon = STEP_ICONS[step - 1];
  const isActive = step === currentStep;
  const isComplete = step < currentStep;

  return (
    <button
      type="button"
      onClick={() => !disabled && onStepClick(step)}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-1 p-1 md:p-2 rounded-lg transition-all min-w-0
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted/50"}
        ${isActive ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground"}
      `}
    >
      <div
        className={`
          flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all flex-shrink-0
          ${isActive ? "bg-primary text-primary-foreground" : ""}
          ${isComplete ? "bg-success text-success-foreground" : ""}
          ${!isActive && !isComplete ? "bg-muted" : ""}
        `}
      >
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <span className="text-[10px] md:text-xs font-medium hidden sm:block truncate max-w-[60px] md:max-w-none text-center">
        {STEP_CONFIGS[step - 1].label}
      </span>
    </button>
  );
}
