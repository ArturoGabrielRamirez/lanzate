"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Props } from "../types/loading-submit-button-type"

function LoadingSubmitButtonContext({ text = "Submit", disabled = false }: Props) {

    const { formState: { isSubmitting } } = useFormContext()

    return (
        <Button type="submit" disabled={isSubmitting || disabled} className="bg-gradient-to-t from-chart-5 to-primary">
            {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Loading..." : text}
        </Button>
    )
}
export default LoadingSubmitButtonContext
