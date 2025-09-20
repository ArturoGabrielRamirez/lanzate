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
            const sizes = form.getValues("sizes") || [] //["XS","S"]
            console.log(sizes)
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