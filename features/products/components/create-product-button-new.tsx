import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger } from "@/features/shadcn/components/ui/dialog"
import { Plus } from "lucide-react"

const CreateProductButtonNew = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>
                    <Plus />
                    <span>Create Product</span>
                </Button>
            </DialogTrigger>
        </Dialog>
    )
}
export default CreateProductButtonNew