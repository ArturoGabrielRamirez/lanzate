"use client";

import { useCallback } from "react";
import { Box, ImageIcon, Layers, Package, Settings } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shadcn/components/ui/dialog";
import { Button } from "@/features/shadcn/components/button";
import { Stepper, Step } from "@/features/global/components/stepper";
import type { StepConfig, RenderStepIndicatorProps } from "@/features/global/types";

import { useCreateProductContext, CreateProductProvider } from "./create-product-provider";
import {
  BasicInfoStep,
  MediaStep,
  OptionsVariantsStep,
  TypeSpecificStep,
  ConfigurationsStep,
} from "./steps";

/**
 * Step configurations with icons and labels
 */
const STEP_CONFIGS: StepConfig[] = [
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
 * Custom step indicator with icons
 */
function CustomStepIndicator({
  step,
  currentStep,
  status,
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
        flex flex-col items-center gap-1 p-2 rounded-lg transition-all
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted/50"}
        ${isActive ? "text-primary" : isComplete ? "text-success" : "text-muted-foreground"}
      `}
    >
      <div
        className={`
          flex items-center justify-center w-10 h-10 rounded-full transition-all
          ${isActive ? "bg-primary text-primary-foreground" : ""}
          ${isComplete ? "bg-success text-success-foreground" : ""}
          ${!isActive && !isComplete ? "bg-muted" : ""}
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-medium hidden md:block">
        {STEP_CONFIGS[step - 1].label}
      </span>
    </button>
  );
}

/**
 * Internal form component that uses the context
 */
function CreateProductFormContent() {
  const {
    step,
    setStep,
    isStepValid,
    isOpen,
    closeDialog,
    resetForm,
    isSubmitting,
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
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Crear Nuevo Producto</DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-hidden">
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
            content: "flex-1",
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

/**
 * Props for CreateProductForm
 */
interface CreateProductFormProps {
  /** Custom trigger button */
  trigger?: React.ReactNode;
}

/**
 * CreateProductForm - Complete product creation form with dialog
 *
 * Wraps the multi-step form in a dialog with the CreateProductProvider.
 * Can be triggered by a custom button or uses a default one.
 *
 * @example
 * // With default trigger
 * <CreateProductForm />
 *
 * // With custom trigger
 * <CreateProductForm trigger={<Button>Crear</Button>} />
 */
export function CreateProductForm({ trigger }: CreateProductFormProps) {
  return (
    <CreateProductProvider>
      <CreateProductFormDialog trigger={trigger} />
    </CreateProductProvider>
  );
}

/**
 * Internal dialog component that uses context
 */
function CreateProductFormDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const { isOpen, openDialog, closeDialog } = useCreateProductContext();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? openDialog() : closeDialog())}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Box className="w-4 h-4 mr-2" />
            Crear Producto
          </Button>
        )}
      </DialogTrigger>
      <CreateProductFormContent />
    </Dialog>
  );
}
