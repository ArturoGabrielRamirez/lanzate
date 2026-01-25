/**
 * Create Product Form Components Index
 *
 * Barrel export for create product form components.
 */

export {
  CreateProductProvider,
  useCreateProductContext,
} from '@/features/products/components/create-form/create-product-provider';

export { CreateProductForm } from '@/features/products/components/create-form/create-product-form';

// Step components
export {
  BasicInfoStep,
  MediaStep,
  OptionsVariantsStep,
  TypeSpecificStep,
  ConfigurationsStep,
} from '@/features/products/components/create-form/steps';
