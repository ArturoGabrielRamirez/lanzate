"use client";

import { Box } from "lucide-react";

import { useCreateProductContext } from "@/features/products/components";
import { CreateProductFormContent } from "@/features/products/components/create-form/create-product-form-content";
import type { CreateProductFormDialogProps } from "@/features/products/types";
import { Button } from "@/features/shadcn/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/features/shadcn/components/ui/dialog";

/**
 * CreateProductFormDialog - Dialog wrapper for the product creation form
 *
 * Handles dialog open/close state via context.
 * Can use a custom trigger or the default button.
 */
export function CreateProductFormDialog({
  trigger,
}: CreateProductFormDialogProps) {
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
