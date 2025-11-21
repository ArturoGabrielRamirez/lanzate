"use client"

import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { CreateStoreContent } from "@/features/stores/components/create-form/create-store-content"
import { CreateStoreProvider, useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

function CreateStoreDialog({ userId }: { userId: number }) {
    const { isOpen, openDialog, closeDialog } = useCreateStoreContext()
    const t = useTranslations("store.create-form")
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => open ? openDialog() : closeDialog()}>
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

export function CreateStoreButton({ userId }: { userId: number }) {
    return (
        <CreateStoreProvider>
            <CreateStoreDialog userId={userId} />
        </CreateStoreProvider>
    )
}
