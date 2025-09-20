"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader, Plus } from "lucide-react"
import MultiStepForm from "./multi-step-form"
import { useCallback, useTransition } from "react"
import { FormValues } from "./validation-schemas"
import { toast } from "sonner"


export default function CreateProductNew({ storeId }: { storeId: number }) {

    const [pending, startTransition] = useTransition()

    const handleCreateProduct = useCallback(async (values: FormValues) => {
        startTransition(async () => {
            console.log(values)
            toast.loading("Creando producto...")
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.dismiss()
            toast.success("Producto creado correctamente")
        })
    }, [])

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
                {!pending && <MultiStepForm storeId={storeId} onComplete={handleCreateProduct} />}
                {pending && <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                    <Loader className="size-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Creando producto...</p>
                </div>}
            </DialogContent>
        </Dialog>
    )
}