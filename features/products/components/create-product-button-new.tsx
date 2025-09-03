import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
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