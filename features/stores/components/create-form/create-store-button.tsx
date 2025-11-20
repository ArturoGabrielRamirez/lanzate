import { Plus } from "lucide-react"

import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { CreateStoreContent } from "@/features/stores/components/create-form/create-store-content"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"

export function CreateStoreButton({ userId }: { userId: number }) {
    return (
        <CreateStoreProvider>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        <span>Create Store</span>
                    </Button>
                </DialogTrigger>
                <CreateStoreContent userId={userId} />
            </Dialog>
        </CreateStoreProvider>
    )
}
