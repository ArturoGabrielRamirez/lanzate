"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState } from "react"
import LoadingSubmitButton from "@/features/layout/components/loading-submit-button"

type Props<T> = {
    text: string
    children: React.ReactNode
    title: string
    description: string
    action: (payload: any) => Promise<{ error: boolean, message: string, payload: T }>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
}

function ButtonWithPopup<T>({ text, children, title, description, action, messages, disabled = false }: Props<T>) {

    const [open, setOpen] = useState(false)

    const handleAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)

        const payload = Object.fromEntries(formData)

        toast.promise(action(payload), {
            loading: messages.loading,
            success: (data) => {
                if (data && data.error) throw new Error(data.message)
                return messages.success
            },
            error: (error) => {
                return error.message
            },
            finally: () => {
                setOpen(false)
            }
        })
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
                <form className="flex flex-col gap-2" onSubmit={handleAction}>
                    {children}
                    <LoadingSubmitButton text="Create" />
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default ButtonWithPopup