"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { Stepper, Step } from "@/features/global/components/stepper";
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider";
import { CustomStepIndicator, STEP_CONFIGS } from "@/features/products/components/create-form/custom-step-indicator";
import {
  BasicInfoStep,
  MediaStep,
  OptionsVariantsStep,
  TypeSpecificStep,
  ConfigurationsStep,
} from "@/features/products/components/create-form/steps/index";
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
 */
export function CreateProductFormContent() {
  const {
    step,
    setStep,
    isStepValid,
    closeDialog,
    resetForm,
    setIsSubmitting,
    values,
  } = useCreateProductContext();

  /**
   * Handle form completion
   */
  const handleComplete = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // TODO: Call createProductAction with values
      console.log("Creating product with values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Producto creado exitosamente");
      closeDialog();
      resetForm();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error al crear el producto");
    } finally {
      setIsSubmitting(false);
    }
  }, [values, setIsSubmitting, closeDialog, resetForm]);

  /**
   * Handle exit flow (back on first step)
   */
  const handleExitFlow = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  return (
    <DialogContent className="w-dvw h-dvh max-w-none max-h-none sm:max-w-5xl sm:max-h-[90vh] sm:h-auto sm:rounded-lg rounded-none overflow-hidden flex flex-col p-0 top-0 left-0 translate-0">
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
            completeButtonText: "Crear Producto",
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
