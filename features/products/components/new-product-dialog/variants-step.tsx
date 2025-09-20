import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"

const VariantsStep = () => {

    const { form } = useMultiStepForm<FormValues>()

    console.log(form.getValues("selected_attributes"))

    const shouldCalculateVariants = (
        form.getValues("selected_attributes")?.includes("Talle") ||
        form.getValues("selected_attributes")?.includes("Dimension") ||
        form.getValues("selected_attributes")?.includes("Color") ||
        form.getValues("selected_attributes")?.includes("Material") ||
        form.getValues("selected_attributes")?.includes("Sabor") ||
        form.getValues("selected_attributes")?.includes("Fragancia")
    )
    
    return (
        <div>variants-step</div>
    )
}
export default VariantsStep