"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/features/global/components/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/global/components/dialog/dialog";
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
    <Dialog responsive="drawer-mobile" open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className={className} startIcon={<PlusIcon />}>
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>
        <CreateStoreForm className="px-2 pb-2"/>
      </DialogContent>
    </Dialog>
  );
}
