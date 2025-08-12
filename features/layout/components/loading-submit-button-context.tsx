"use client"

/* import { Button } from "@/components/ui/button" */
import { Loader } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Props } from "../types/loading-submit-button-type"
import { PrimaryButton } from "./universal-button"
function LoadingSubmitButtonContext({ text = "Submit", disabled = false }: Props) {

    const { formState: { isSubmitting } } = useFormContext()

    return (
        <PrimaryButton type="submit" disabled={isSubmitting || disabled}>
            {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Loading..." : text}
        </PrimaryButton>
    )
}
export default LoadingSubmitButtonContext
