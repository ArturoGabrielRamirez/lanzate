/**
 * Create Product Form Types
 *
 * Type definitions for the multi-step product creation form.
 * These types define the form state structure and context interface
 * used by the CreateProductProvider.
 */

import type { ProductStatus, AttributeType } from '@prisma/client';

/**
 * Basic Info Step Data
 *
 * Contains product name, description, slug, brand, status, and SEO fields.
 */
export interface CreateProductBasicInfo {
  name: string;
  description: string;
  slug: string;
  brand: string;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
  urlSlug: string;
  ogImageUrl: string;
}

/**
 * Media Step Data
 *
 * Contains product images with ordering and primary selection.
 */
export interface CreateProductMediaItem {
  id?: string;
  url: string;
  altText: string;
  position: number;
  isPrimary: boolean;
  file?: File;
}

export interface CreateProductMedia {
  images: CreateProductMediaItem[];
}

/**
 * Product Option (Attribute) for variant generation
 *
 * Represents a customizable product attribute like Size or Color.
 */
export interface CreateProductOption {
  id: string;
  name: string;
  type: AttributeType;
  values: CreateProductOptionValue[];
}

export interface CreateProductOptionValue {
  id: string;
  value: string;
}

/**
 * Product Variant for the form
 *
 * Represents a specific combination of attribute values with pricing.
 */
export interface CreateProductVariantForm {
  id: string;
  sku: string;
  price: number;
  promotionalPrice: number | null;
  cost: number | null;
  attributeValueIds: string[];
  attributeCombination: string;
  isEnabled: boolean;
}

/**
 * Variants Step Data
 *
 * Contains options (attributes) and generated variant combinations.
 */
export interface CreateProductVariants {
  hasVariants: boolean;
  options: CreateProductOption[];
  variants: CreateProductVariantForm[];
}

/**
 * Digital Product Configuration
 *
 * Configuration for digital products (downloadable files).
 */
export interface CreateProductDigitalConfig {
  downloadUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  expirationDate: Date | null;
  downloadLimit: number | null;
}

/**
 * Physical Product Configuration
 *
 * Configuration for physical products (shipping dimensions).
 */
export interface CreateProductPhysicalConfig {
  weight: number | null;
  weightUnit: 'kg' | 'lb' | 'g' | 'oz';
  width: number | null;
  height: number | null;
  depth: number | null;
  dimensionUnit: 'cm' | 'in' | 'm';
}

/**
 * Configurations Step Data
 *
 * Contains product type settings, inventory, and flags.
 */
export interface CreateProductConfigurations {
  isDigital: boolean;
  trackInventory: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  allowPromotions: boolean;
  digital: CreateProductDigitalConfig | null;
  physical: CreateProductPhysicalConfig | null;
}

/**
 * Complete Form State
 *
 * Contains all data for the multi-step product creation form.
 * Organized by step: basicInfo, media, variants, configurations.
 */
export interface CreateProductFormState {
  basicInfo: CreateProductBasicInfo;
  media: CreateProductMedia;
  variants: CreateProductVariants;
  configurations: CreateProductConfigurations;
}

/**
 * Step validation state
 *
 * Tracks which steps have been validated successfully.
 */
export type CreateProductStepValidation = Record<number, boolean>;

/**
 * Create Product Context Type
 *
 * Interface for the CreateProductProvider context value.
 * Provides form state, update methods, and step navigation.
 */
export interface CreateProductContextType {
  /** Current form values */
  values: CreateProductFormState;
  /** Update form values (partial update) */
  setValues: (partial: Partial<CreateProductFormState>) => void;
  /** Update basic info step values */
  setBasicInfo: (data: Partial<CreateProductBasicInfo>) => void;
  /** Update media step values */
  setMedia: (data: Partial<CreateProductMedia>) => void;
  /** Update variants step values */
  setVariants: (data: Partial<CreateProductVariants>) => void;
  /** Update configurations step values */
  setConfigurations: (data: Partial<CreateProductConfigurations>) => void;
  /** Step validation state */
  isStepValid: CreateProductStepValidation;
  /** Set validation state for a specific step */
  setStepValid: (step: number, valid: boolean) => void;
  /** Current step number (1-indexed) */
  step: number;
  /** Set current step */
  setStep: (step: number) => void;
  /** Go to next step */
  goToNextStep: () => void;
  /** Go to previous step */
  goToPrevStep: () => void;
  /** Whether can navigate to next step */
  canGoToNextStep: boolean;
  /** Whether can navigate to previous step */
  canGoToPrevStep: boolean;
  /** Whether dialog is open */
  isOpen: boolean;
  /** Open the create product dialog */
  openDialog: () => void;
  /** Close the create product dialog */
  closeDialog: () => void;
  /** Reset form to initial values */
  resetForm: () => void;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Set submitting state */
  setIsSubmitting: (isSubmitting: boolean) => void;
}

/**
 * Props for CreateProductProvider component
 */
export interface CreateProductProviderProps {
  children: React.ReactNode;
  initialValues?: Partial<CreateProductFormState>;
}

/**
 * Props for CreateProductForm component
 */
export interface CreateProductFormProps {
  /** Custom trigger button */
  trigger?: React.ReactNode;
  /** Store ID to create product in */
  storeId: string;
}

/**
 * Props for CreateProductFormDialog component
 */
export interface CreateProductFormDialogProps {
  /** Custom trigger button */
  trigger?: React.ReactNode;
  /** Store ID to create product in */
  storeId: string;
}

/**
 * Props for CreateProductFormContent component
 */
export interface CreateProductFormContentProps {
  /** Store ID to create product in */
  storeId: string;
}
