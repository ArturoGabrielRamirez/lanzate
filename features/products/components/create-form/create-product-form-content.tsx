"use client";

import { startTransition, useCallback } from "react";
import { toast } from "sonner";

import { Stepper, Step } from "@/features/global/components/stepper";
import { createProductAction } from "@/features/products/actions";
import { CustomStepIndicator, STEP_CONFIGS } from "@/features/products/components/create-form/custom-step-indicator";
import {
  BasicInfoStep,
  MediaStep,
  OptionsVariantsStep,
  TypeSpecificStep,
  ConfigurationsStep,
} from "@/features/products/components/create-form/steps/index";
import { PRODUCT_SUCCESS_MESSAGES, PRODUCT_ERROR_MESSAGES } from "@/features/products/constants";
import { useCreateProductContext } from "@/features/products/hooks";
import type { CreateProductFormContentProps } from "@/features/products/types";
import { mapFormStateToActionInput } from "@/features/products/utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/shadcn/components/ui/dialog";

/**
 * CreateProductFormContent - Form content for the create product dialog
 *
 * Contains the multi-step form with all product creation steps.
 * Uses the CreateProductContext for state management.
 * Integrates with createProductAction for real product creation.
 */
export function CreateProductFormContent({ storeId }: CreateProductFormContentProps) {
  const {
    step,
    setStep,
    isStepValid,
    closeDialog,
    resetForm,
    setIsSubmitting,
    isSubmitting,
    values,
  } = useCreateProductContext();

  /**
   * Validate all steps before submission
   */
  const validateAllSteps = useCallback((): boolean => {
    // Step 1 (Basic Info) must be valid
    if (!isStepValid[1]) {
      toast.error("Completa la informacion basica del producto");
      setStep(1);
      return false;
    }
    // Step 2 (Media) is optional, always valid
    // Step 3 (Variants) - if has variants, must have at least one valid
    if (!isStepValid[3]) {
      toast.error("Revisa las opciones y variantes del producto");
      setStep(3);
      return false;
    }
    // Step 4 (Type Specific) is optional
    // Step 5 (Configurations) is optional, always valid
    return true;
  }, [isStepValid, setStep]);

  /**
   * Handle form completion - calls createProductAction
   */
  const handleComplete = useCallback(async () => {
    if (!validateAllSteps()) return;
    if (!storeId) {
      toast.error("No se encontro la tienda");
      return;
    }

    setIsSubmitting(true);

    startTransition(async () => {

      try {
        const actionInput = mapFormStateToActionInput(values, storeId);
        const result = await createProductAction(actionInput);

        if (result.hasError) {
          toast.error(result.message || PRODUCT_ERROR_MESSAGES.CREATE_FAILED.es);
          return;
        }

        toast.success(PRODUCT_SUCCESS_MESSAGES.CREATE.es);
        closeDialog();
        resetForm();
      } catch {
        toast.error(PRODUCT_ERROR_MESSAGES.CREATE_FAILED.es);
      } finally {
        setIsSubmitting(false);
      }
    })
  }, [values, storeId, setIsSubmitting, closeDialog, resetForm, validateAllSteps]);

  /**
   * Handle exit flow (back on first step)
   */
  const handleExitFlow = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  return (
    <DialogContent className="w-dvw h-dvh max-w-none max-h-none sm:max-h-[90vh] sm:h-auto sm:rounded-lg rounded-none overflow-hidden flex flex-col p-0 inset-0 max-sm:transform-none max-sm:top-0 max-sm:left-0 max-sm:translate-none sm:top-1/2 sm:left-1/2">
      <DialogHeader className="px-6 pt-6 pb-2">
        <DialogTitle>Crear Nuevo Producto</DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-hidden px-2 md:px-3 xl:px-6 xl:pb-6 min-h-0">
        <Stepper
          currentStep={step}
          onStepChange={setStep}
          onFinalStepCompleted={handleComplete}
          onExitFlow={handleExitFlow}
          steps={STEP_CONFIGS}
          stepValidation={isStepValid}
          allowStepClick
          renderStepIndicator={(props) => <CustomStepIndicator {...props} />}
          navigationConfig={{
            backButtonText: "Anterior",
            nextButtonText: "Siguiente",
            completeButtonText: isSubmitting ? "Creando..." : "Crear Producto",
            showBackOnFirstStep: true,
            exitFlowTooltip: "Cancelar y cerrar",
          }}
          classNames={{
            root: "h-full",
            content: "flex-1 min-h-0",
          }}
        >
          <Step>
            <BasicInfoStep />
          </Step>
          <Step>
            <MediaStep />
          </Step>
          <Step>
            <OptionsVariantsStep />
          </Step>
          <Step>
            <TypeSpecificStep />
          </Step>
          <Step>
            <ConfigurationsStep />
          </Step>
        </Stepper>
      </div>
    </DialogContent>
  );
}
