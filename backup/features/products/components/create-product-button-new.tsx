import { Plus } from "lucide-react"

import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"

function CreateProductButtonNew() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    <Plus />
                    <span>Crear Producto</span>
                </Button>
            </DialogTrigger>
        </Dialog>
    )
}
export { CreateProductButtonNew }