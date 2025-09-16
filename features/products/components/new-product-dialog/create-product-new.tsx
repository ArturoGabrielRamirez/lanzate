"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
            <DialogContent isScroll>
                <DialogTitle>Create Product</DialogTitle>
                <DialogDescription>Create a new product</DialogDescription>
                <MultiStepForm storeId={storeId} />
            </DialogContent>
        </Dialog>
    )
}