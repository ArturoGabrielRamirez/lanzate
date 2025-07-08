"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import Form from "./form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ButtonWithPopupPropsType } from "../types/button-with-popup-type"


function ButtonWithPopup<T>({
    text,
    children = "No content set",
    title = "Popup title",
    description = "Popup description",
    action,
    messages,
    disabled = false,
    schema
}: ButtonWithPopupPropsType<T>) {

    const [open, setOpen] = useState(false)

    const handleComplete = async () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>{text}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    resolver={yupResolver(schema)}
                    formAction={action}
                    contentButton="Create"
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