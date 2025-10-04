import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { useEffect } from "react"

const VariantsStep = () => {

    const { form } = useMultiStepForm<FormValues>()

    const selected_attributes = form.getValues("selected_attributes") || []
    const shouldCalculateVariants = (
        selected_attributes.includes("Talle") ||
        selected_attributes.includes("Dimension") ||
        selected_attributes.includes("Color") ||
        selected_attributes.includes("Material") ||
        selected_attributes.includes("Sabor") ||
        selected_attributes.includes("Fragancia")
    )

    const calculateVariants = (selected_attributes: string[]) => {
        const variants = []

        if (selected_attributes.includes("Talle")) {
            const sizes = form.getValues("sizes") || [] //[{id: 1, label: "XS"}, {id: 2, label: "S"}]
            for (const size of sizes) {
                variants.push({
                    size : size.label,
                    size_id: size.id,
                })
            }
        }

        if (selected_attributes.includes("Dimension")) {
            const dimensions = form.getValues("dimensions") || [] //[{id: 1, label: "100x100"}, {id: 2, label: "200x200"}]
            for (const dimension of dimensions) {
                
            }
        }

        if (selected_attributes.includes("Color")) {
            const colors = form.getValues("colors") || [] //[{id: 1, label: "Red"}, {id: 2, label: "Blue"}]
        }

        if (selected_attributes.includes("Material")) {
            const materials = form.getValues("materials") || [] //[{id: 1, label: "Wood"}, {id: 2, label: "Metal"}]
        }

        if (selected_attributes.includes("Sabor")) {
            const flavors = form.getValues("flavors") || [] //[{id: 1, label: "Vanilla"}, {id: 2, label: "Chocolate"}]
        }

        if (selected_attributes.includes("Fragancia")) {
            const fragrances = form.getValues("fragrances") || [] //[{id: 1, label: "Vanilla"}, {id: 2, label: "Chocolate"}]
        }

        return variants
    }

    useEffect(() => {
        if (shouldCalculateVariants) {
            const variants = calculateVariants(selected_attributes)
            console.log("🚀 ~ useEffect ~ variants:", variants)
        }
    }, [])

    return (
        <div>variants-step</div>
    )
}
export default VariantsStep