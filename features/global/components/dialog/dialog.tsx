"use client"

import { X } from "lucide-react"
import * as React from "react"


import { dialogContentVariants } from "@/features/global/components/dialog/dialog-variants"
import { DialogContext } from "@/features/global/contexts/dialog-context"
import { useDialogContext } from "@/features/global/hooks/use-dialog-context"
import type {
    DialogCloseProps,
    DialogContentProps,
    DialogDescriptionProps,
    DialogFooterProps,
    DialogHeaderProps,
    DialogProps,
    DialogTitleProps,
} from "@/features/global/types/dialog.types"
import {
    Dialog as ShadcnDialog,
    DialogClose as ShadcnDialogClose,
    DialogContent as ShadcnDialogContent,
    DialogDescription as ShadcnDialogDescription,
    DialogFooter as ShadcnDialogFooter,
    DialogHeader as ShadcnDialogHeader,
    DialogOverlay as ShadcnDialogOverlay,
    DialogPortal as ShadcnDialogPortal,
    DialogTitle as ShadcnDialogTitle,
    DialogTrigger as ShadcnDialogTrigger,
} from "@/features/shadcn/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/features/shadcn/components/ui/drawer"
import { useIsMobile } from "@/features/shadcn/hooks/use-mobile"
import { cn } from "@/features/shadcn/utils/cn"


// ---- Root ----

function Dialog({ responsive = "default", children, ...props }: DialogProps) {
    const isMobile = useIsMobile()
    const useDrawer = responsive === "drawer-mobile" && isMobile

    const Root = useDrawer ? Drawer : ShadcnDialog

    return (
        <DialogContext.Provider value={{ responsive, isMobile }}>
            <Root {...props}>{children}</Root>
        </DialogContext.Provider>
    )
}
Dialog.displayName = "Dialog"

// ---- Trigger ----

const DialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof ShadcnDialogTrigger>
>(({ className, children, ...props }, ref) => {
    const { responsive, isMobile } = useDialogContext()
    const useDrawer = responsive === "drawer-mobile" && isMobile
    const Comp = useDrawer ? DrawerTrigger : ShadcnDialogTrigger

    return (
        <Comp ref={ref} data-slot="dialog-trigger" className={className} {...props}>
            {children}
        </Comp>
    )
})
DialogTrigger.displayName = "DialogTrigger"

// ---- Content ----

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className, size, showClose = true, children, ...props }, ref) => {
        const { responsive, isMobile } = useDialogContext()

        // drawer-mobile on mobile → Vaul Drawer
        if (responsive === "drawer-mobile" && isMobile) {
            return (
                <DrawerContent
                    ref={ref}
                    data-slot="dialog-content"
                    className={cn("max-h-[90vh]", className)}
                    {...props}
                >
                    {children}
                </DrawerContent>
            )
        }

        // fullscreen-mobile on mobile → full-screen Radix Dialog
        if (responsive === "fullscreen-mobile" && isMobile) {
            return (
                <ShadcnDialogPortal>
                    <ShadcnDialogOverlay />
                    <div
                        ref={ref}
                        role="dialog"
                        data-slot="dialog-content"
                        className={cn(
                            "fixed inset-0 z-50 flex flex-col bg-background",
                            "animate-in fade-in-0 slide-in-from-bottom-4 duration-200",
                            className
                        )}
                        {...props}
                    >
                        {showClose && (
                            <ShadcnDialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </ShadcnDialogClose>
                        )}
                        {children}
                    </div>
                </ShadcnDialogPortal>
            )
        }

        // default / desktop → standard centered Radix Dialog with CVA size
        return (
            <ShadcnDialogContent
                ref={ref}
                data-slot="dialog-content"
                className={cn(dialogContentVariants({ size }), className)}
                {...props}
            >
                {children}
            </ShadcnDialogContent>
        )
    }
)
DialogContent.displayName = "DialogContent"

// ---- Header ----

function DialogHeader({ className, ...props }: DialogHeaderProps) {
    const { responsive, isMobile } = useDialogContext()

    if (responsive === "drawer-mobile" && isMobile) {
        return <DrawerHeader data-slot="dialog-header" className={className} {...props} />
    }

    if (responsive === "fullscreen-mobile" && isMobile) {
        return (
            <div
                data-slot="dialog-header"
                className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
                {...props}
            />
        )
    }

    return <ShadcnDialogHeader data-slot="dialog-header" className={className} {...props} />
}
DialogHeader.displayName = "DialogHeader"

// ---- Footer ----

function DialogFooter({ className, ...props }: DialogFooterProps) {
    const { responsive, isMobile } = useDialogContext()

    if (responsive === "drawer-mobile" && isMobile) {
        return <DrawerFooter data-slot="dialog-footer" className={className} {...props} />
    }

    if (responsive === "fullscreen-mobile" && isMobile) {
        return (
            <div
                data-slot="dialog-footer"
                className={cn("mt-auto flex flex-col gap-2 p-6 pt-0", className)}
                {...props}
            />
        )
    }

    return <ShadcnDialogFooter data-slot="dialog-footer" className={className} {...props} />
}
DialogFooter.displayName = "DialogFooter"

// ---- Title ----

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
    ({ className, ...props }, ref) => {
        const { responsive, isMobile } = useDialogContext()

        if (responsive === "drawer-mobile" && isMobile) {
            return (
                <DrawerTitle
                    ref={ref}
                    data-slot="dialog-title"
                    className={className}
                    {...props}
                />
            )
        }

        return (
            <ShadcnDialogTitle
                ref={ref}
                data-slot="dialog-title"
                className={className}
                {...props}
            />
        )
    }
)
DialogTitle.displayName = "DialogTitle"

// ---- Description ----

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
    ({ className, ...props }, ref) => {
        const { responsive, isMobile } = useDialogContext()

        if (responsive === "drawer-mobile" && isMobile) {
            return (
                <DrawerDescription
                    ref={ref}
                    data-slot="dialog-description"
                    className={className}
                    {...props}
                />
            )
        }

        return (
            <ShadcnDialogDescription
                ref={ref}
                data-slot="dialog-description"
                className={className}
                {...props}
            />
        )
    }
)
DialogDescription.displayName = "DialogDescription"

// ---- Close ----

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
    ({ className, children, ...props }, ref) => {
        const { responsive, isMobile } = useDialogContext()

        if (responsive === "drawer-mobile" && isMobile) {
            return (
                <DrawerClose ref={ref} data-slot="dialog-close" className={className} {...props}>
                    {children}
                </DrawerClose>
            )
        }

        return (
            <ShadcnDialogClose ref={ref} data-slot="dialog-close" className={className} {...props}>
                {children}
            </ShadcnDialogClose>
        )
    }
)
DialogClose.displayName = "DialogClose"

export {
    Dialog,
    DialogClose,
    DialogContent,
    dialogContentVariants,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
}
