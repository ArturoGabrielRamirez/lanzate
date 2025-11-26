"use client"

import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback } from "react"

import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { CreateStoreContent } from "@/features/stores/components/create-form/create-store-content"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function CreateStoreDialog({ userId }: { userId: number }) {

    const { isOpen, openDialog, closeDialog } = useCreateStoreContext()

    const t = useTranslations("store.create-form")

    const handleToggleDialog = useCallback((open: boolean) => {
        if (open) return openDialog()
        return closeDialog()
    }, [openDialog, closeDialog])

    return (
        <Dialog open={isOpen} onOpenChange={handleToggleDialog}>
            <DialogTrigger asChild>
                <Button onClick={openDialog}>
                    <Plus />
                    <span>{t("button")}</span>
                </Button>
            </DialogTrigger>
            <CreateStoreContent userId={userId} />
        </Dialog>
    )
}

