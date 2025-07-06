"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useFormStatus } from "react-dom"


type Props = {
    text?: string
}
function LoadingSubmitButton({ text = "Submit" }: Props) {

    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader className="w-4 h-4 animate-spin" />}
            {pending ? "Loading..." : text}
        </Button>
    )
}
export default LoadingSubmitButton
