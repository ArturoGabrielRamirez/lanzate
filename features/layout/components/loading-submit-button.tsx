"use client"

import { Button } from "@/features/shadcn/components/ui/button"
import { useFormStatus } from "react-dom"
import { Loader } from "lucide-react"

import { LoadingSubmitButtonProps } from "@/features/layout/types"

function LoadingSubmitButton({ text = "Submit" }: LoadingSubmitButtonProps) {

    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader className="w-4 h-4 animate-spin" />}
            {pending ? "Loading..." : text}
        </Button>
    )
}
export default LoadingSubmitButton
