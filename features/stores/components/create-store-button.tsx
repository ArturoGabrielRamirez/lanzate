import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {}

function CreateStoreButton({ }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create Store</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new store</DialogTitle>
                    <DialogDescription>
                        Create a new store to start selling your products! Choose a name for your store and click on the button below, you can continue to add more details of the store once it's created.
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input type="text" />
                    </div>
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateStoreButton