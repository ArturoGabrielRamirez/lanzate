"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"

import { ButtonWithPopupPropsType } from "@/features/layout/types"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DangerButton, PrimaryButton } from "./universal-button"

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
    variant = "default",
    className,
    size = "default",
    formDisabled = false,
    contentButton
}: ButtonWithPopupPropsType<T>) {

    const [open, setOpen] = useState(false)

    const handleSuccess = async () => {
        setOpen(false)
        if (onComplete && typeof onComplete === "function") {
            onComplete()
        }
    }

    const resolverConfig = schema ? { resolver: yupResolver(schema) } : {}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant == "destructive" ? (
                    <DangerButton disabled={disabled} type="button" className={cn(className)}>{text}</DangerButton>
                ) : (
                    <PrimaryButton disabled={disabled} type="button" className={cn(className)}>{text}</PrimaryButton>
                )}
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
                    contentButton={contentButton || text}
                    successMessage={messages.success}
                    loadingMessage={messages.loading}
                    onSuccess={handleSuccess}
                    disabled={formDisabled}
                >
                    {children}
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default ButtonWithPopup