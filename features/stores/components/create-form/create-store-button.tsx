import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { CreateStoreContent } from "@/features/stores/components/create-form/create-store-content"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"

export function CreateStoreButton({ userId }: { userId: number }) {
    const t = useTranslations("store.create-form")
    
    return (
        <CreateStoreProvider>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>{t("button")}</span>
                    </Button>
                </DialogTrigger>
                <CreateStoreContent userId={userId} />
            </Dialog>
        </CreateStoreProvider>
    )
}
