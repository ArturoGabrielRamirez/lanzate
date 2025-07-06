"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createStore } from "../actions/createStore"
import { toast } from "sonner"
import { useState } from "react"
import LoadingSubmitButton from "@/features/layout/components/loading-submit-button"

type Props = {
    userId: number
}

function CreateStoreButton({ userId }: Props) {

    const [open, setOpen] = useState(false)

    const handleCreateStore = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get("name")

        if (!name) return console.error("Name is required")
        if (!userId) return console.error("User ID is required")

        toast.promise(createStore(name as string, userId), {
            loading: "Creating store...",
            success: (data) => {
                if (data.error) throw new Error(data.message)
                return "Store created successfully!"
            },
            error: "Error creating store",
            finally: () => {
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <form className="flex flex-col gap-2" onSubmit={handleCreateStore}>
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input type="text" name="name" />
                    </div>
                    <LoadingSubmitButton text="Create" />
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateStoreButton