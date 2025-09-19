"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import MultiStepForm from "./multi-step-form"


export default function CreateProductNew({ storeId }: { storeId: number }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    <span>Create Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent isScroll className="h-dvh lg:max-h-[80vh] overflow-y-auto overflow-x-hidden grid-rows-[auto_1fr]">
                <DialogHeader>
                    <DialogTitle>Create Product</DialogTitle>
                    <DialogDescription>Create a new product</DialogDescription>
                </DialogHeader>
                <MultiStepForm storeId={storeId} />
            </DialogContent>
        </Dialog>
    )
}