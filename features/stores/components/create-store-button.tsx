"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/features/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shadcn/components/ui/dialog";
import { CreateStoreForm } from "@/features/stores/components/create-store-form";
import type { CreateStoreButtonProps } from "@/features/stores/types";

/**
 * CreateStoreButton Component
 *
 * A button that opens a dialog to create a new store.
 * This is a simple button + dialog component without access control logic.
 * For access control (limit enforcement), wrap with CreateStoreButtonGate.
 *
 * @example
 * ```tsx
 * // Simple usage (no access control)
 * <CreateStoreButton />
 *
 * // With access control (recommended)
 * <CreateStoreButtonGate
 *   currentStoreCount={2}
 *   accountType="FREE"
 * />
 * ```
 */
export function CreateStoreButton({
  className,
  disabled = false,
}: CreateStoreButtonProps) {
  const t = useTranslations("store.create");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className={className}>
          <PlusIcon className="h-4 w-4 mr-2" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>
        <CreateStoreForm />
      </DialogContent>
    </Dialog>
  );
}
