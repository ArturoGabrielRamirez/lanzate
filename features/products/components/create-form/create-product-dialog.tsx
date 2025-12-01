"use client"

import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback } from "react"

import { CreateProductContent } from "@/features/products/components/create-form/create-product-content"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"

export function CreateProductDialog({ userId, storeId }: { userId: number; storeId?: number }) {

    const { isOpen, openDialog, closeDialog } = useCreateProductContext()

    const t = useTranslations("store.create-product")

    const handleToggleDialog = useCallback((open: boolean) => {
        if (open) return openDialog()
        return closeDialog()
    }, [openDialog, closeDialog])

    return (
        <Dialog open={isOpen} onOpenChange={handleToggleDialog} modal={false}>
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"/>
            )}
            <DialogTrigger asChild>
                <Button onClick={openDialog}>
                    <Plus />
                    <span>{t("button")}</span>
                </Button>
            </DialogTrigger>
            <CreateProductContent userId={userId} storeId={storeId} />
        </Dialog>
    )
}

