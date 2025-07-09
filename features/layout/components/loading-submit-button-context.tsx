"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { LoadingSubmitButtonType } from "../types/loading-submit-button-type"

function LoadingSubmitButtonContext({ text = "Submit" }: LoadingSubmitButtonType) {

    const { formState: { isSubmitting } } = useFormContext()

    return (
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Loading..." : text}
        </Button>
    )
}
export default LoadingSubmitButtonContext
