"use client";

import { CreateProductFormDialog } from "@/features/products/components/create-form/create-product-form-dialog";
import { CreateProductProvider } from "@/features/products/components/create-form/create-product-provider";
import type { CreateProductFormProps } from "@/features/products/types";

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
