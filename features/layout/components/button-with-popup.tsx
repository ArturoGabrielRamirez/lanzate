"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"

import { ButtonWithPopupPropsType } from "@/features/layout/types"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"

function ButtonWithPopup<T>({
    text,
    children,
    title = "Popup title",
    description = "Popup description",
    action,
    messages,
    disabled = false,
    schema,
    onComplete,
    variant = "default"
}: ButtonWithPopupPropsType<T>) {

    const [open, setOpen] = useState(false)

    const handleComplete = async () => {
        setOpen(false)
        onComplete && typeof onComplete === "function" && onComplete()
    }

    const resolverConfig = schema ? { resolver: yupResolver(schema) } : {}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled} variant={variant}>{text}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    resolver={resolverConfig.resolver}
                    formAction={action}
                    contentButton={text}
                    successMessage={messages.success}
                    loadingMessage={messages.loading}
                    onComplete={handleComplete}
                >
                    {children}
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default ButtonWithPopup