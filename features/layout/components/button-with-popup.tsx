"use client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"

import { ButtonWithPopupPropsType } from "@/features/layout/types"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
    contentButton,
    onlyIcon
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
                <div>
                    {onlyIcon ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IconButton disabled={disabled} type="button" className={cn(disabled && "cursor-not-allowed text-muted-foreground", className)} icon={() => text} size={"md"}/>
                            </TooltipTrigger>
                            <TooltipContent>
                                {title}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button disabled={disabled} variant={variant} type="button" className={cn(className)} size={size}>{text}</Button>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
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