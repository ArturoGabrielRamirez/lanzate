/**
 * Create Product Form Components Index
 *
 * Barrel export for create product form components.
 */

export {
  CreateProductProvider,
  CreateProductContext,
} from '@/features/products/components/create-form/create-product-provider';

export { useCreateProductContext } from '@/features/products/hooks';

export { CreateProductForm } from '@/features/products/components/create-form/create-product-form';
export { CreateProductFormDialog } from '@/features/products/components/create-form/create-product-form-dialog';
export { CreateProductFormContent } from '@/features/products/components/create-form/create-product-form-content';
export { CustomStepIndicator, STEP_CONFIGS } from '@/features/products/components/create-form/custom-step-indicator';

// Step components
export {
  BasicInfoStep,
  MediaStep,
  OptionsVariantsStep,
  TypeSpecificStep,
  ConfigurationsStep,
} from '@/features/products/components/create-form/steps';
