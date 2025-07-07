"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"

type Props = {}

function CreateProductButton({ }: Props) {

    const handleCreateProduct = async (payload: any) => {
        console.log(payload)
    }

    return (
        <ButtonWithPopup
            text="Create product"
            title="Create new product"
            description="Create a new product to start selling your products! Choose a name for your product and click on the button below, you can continue to add more details of the product once it's created."
            action={handleCreateProduct}
            messages={{
                success: "Product created successfully!",
                error: "Failed to create product",
                loading: "Creating product..."
            }}
        >
            <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input type="text" name="name" />
            </div>
        </ButtonWithPopup>
    )
}
export default CreateProductButton