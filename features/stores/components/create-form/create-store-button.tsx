import { Plus } from "lucide-react"

import { Button } from "@/features/shadcn/components/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"

function CreateStoreButtonNew({ userId }: { userId: number }) {
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

export { CreateStoreButtonNew }