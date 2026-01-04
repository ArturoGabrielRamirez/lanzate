"use client";

import { Loader } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { LoadingSubmitButtonProps } from "@/features/global/types/form";
import { Button } from "@/features/shadcn/components/ui/button";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Loading Submit Button Component
 *
 * A submit button that integrates with React Hook Form to display loading states
 * during form submission. Shows a loading spinner and "Cargando..." text when submitting.
 *
 * Features:
 * - Automatic loading state from React Hook Form context
 * - Disabled state during submission
 * - Loading spinner animation
 * - Customizable text and styling
 *
 * @example
 * ```tsx
 * <LoadingSubmitButton
 *   text="Sign Up"
 *   className="w-full"
 * />
 * ```
 */
export function LoadingSubmitButton({
  text = "Submit",
  disabled = false,
  className,
}: LoadingSubmitButtonProps) {
  const { formState: { isSubmitting } } = useFormContext();

  return (
    <Button
      type="submit"
      disabled={isSubmitting || disabled}
      className={cn(
        className
      )}
      size="lg"
    >
      {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
      {isSubmitting ? "Cargando..." : text}
    </Button>
  );
}
