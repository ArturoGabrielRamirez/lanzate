"use client";

import { useContext } from "react";

import { CreateProductContext } from "@/features/products/components/create-form/create-product-provider";
import type { CreateProductContextType } from "@/features/products/types";

/**
 * Hook to access the create product form context
 *
 * @throws Error if used outside of CreateProductProvider
 * @returns The create product context value
 *
 * @example
 * const { values, setBasicInfo, goToNextStep } = useCreateProductContext();
 */
export function useCreateProductContext(): CreateProductContextType {
  const ctx = useContext(CreateProductContext);
  if (!ctx) {
    throw new Error("useCreateProductContext must be used within CreateProductProvider");
  }
  return ctx;
}
