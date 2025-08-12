"use client"

import { extendVariants, Button, ButtonProps } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";
import { forwardRef } from "react";


export const CustomButtonConfig = extendVariants(Button, {
    variants: {
        radius: {
            md: "rounded-md"
        }
    },
    defaultVariants: {
        radius: "md"
    }
})

type CustomButtonProps = ButtonProps & {
    tooltip?: string
}

export const CustomButton = forwardRef<React.ComponentRef<typeof CustomButtonConfig>, CustomButtonProps>(
    ({ children, tooltip, ...props }, ref) => {

        if (!tooltip) {
            return (
                <CustomButtonConfig ref={ref} {...props}>
                    {children}
                </CustomButtonConfig>
            )
        }

        return (
            <Tooltip content={tooltip}>
                <CustomButtonConfig ref={ref} {...props}>
                    {children}
                </CustomButtonConfig>
            </Tooltip>
        )
    }
)

CustomButton.displayName = "CustomButton"

export const PrimaryButton = extendVariants(CustomButton, {
    variants: {
        color: {
            primary: `
            bg-gradient-to-r
            from-[oklch(from_hsla(var(--heroui-primary))_0.45_c_h/1)]
            via-[oklch(from_hsla(var(--heroui-primary))_0.75_c_h/1)]
            to-[oklch(from_hsla(var(--heroui-primary))_0.45_c_h/1)]
            from-0%
            via-50%
            to-100%
            [background-size:200%_auto]
            hover:[background-position:right_center]
            transition-all
            duration-400
            dark:[box-shadow:0_3px_6px_1px_oklch(from_hsla(var(--heroui-primary))_0.45_c_h/0.5)]
            `,
        },
        size: {
            md: "text-sm md:text-base px-2 md:px-4 py-1 md:py-2 h-8 md:h-10"
        }
    },
    defaultVariants: {
        color: "primary",
        variant: "shadow",
        size: "md"
    }
})

type SecondaryButtonProps = ButtonProps & {
    tooltip?: string
}

export const SecondaryButtonConfig = extendVariants(CustomButton, {
    variants: {
        color: {
            primary: `
                border-[oklch(from_hsla(var(--heroui-primary))_0.45_c_h/1)]
                text-[oklch(from_hsla(var(--heroui-primary))_0.45_c_h/1)]
                hover:bg-[oklch(from_hsla(var(--heroui-primary))_0.45_c_h/1)]
                hover:text-white
            `
        },
        size: {
            md: "text-sm md:text-base px-2 md:px-4 py-1 md:py-2 h-8 md:h-10"
        }
    },
    defaultVariants: {
        color: "primary",
        variant: "ghost",
        size: "md"
    }
})

export const SecondaryButton = forwardRef<React.ComponentRef<typeof SecondaryButtonConfig>, SecondaryButtonProps>(
    ({ children, tooltip, ...props }, ref) => {
        if (!tooltip) {
            return (
                <SecondaryButtonConfig ref={ref} {...props}>
                    {children}
                </SecondaryButtonConfig>
            )
        }

        return (
            <Tooltip content={tooltip}>
                <SecondaryButtonConfig ref={ref} {...props}>
                    {children}
                </SecondaryButtonConfig>
            </Tooltip>
        )
    }
)

SecondaryButton.displayName = "SecondaryButton"

type IconButtonProps = ButtonProps & {
    tooltip?: string
}

export const IconButtonConfig = extendVariants(CustomButton, {
    variants: {
        color: {
            icon: `
            `
        }
    },
    defaultVariants: {
        color: "primary",
        variant: "light"
    },
})


export const IconButton = forwardRef<React.ComponentRef<typeof IconButtonConfig>, IconButtonProps>(
    ({ children, tooltip, ...props }, ref) => {
        if (!tooltip) {
            return (
                <IconButtonConfig ref={ref} {...props} isIconOnly>
                    {children}
                </IconButtonConfig>
            )
        }

        return (
            <Tooltip content={tooltip}>
                <IconButtonConfig ref={ref} {...props} isIconOnly>
                    {children}
                </IconButtonConfig>
            </Tooltip>
        )
    }
)

IconButton.displayName = "IconButton"

type DangerButtonProps = ButtonProps & {
    tooltip?: string
}

export const DangerButtonConfig = extendVariants(CustomButton, {
    variants: {
        color: {
            danger: `
            bg-gradient-to-r
            from-[oklch(from_hsla(var(--heroui-danger))_0.25_c_h/1)]
            via-[oklch(from_hsla(var(--heroui-danger))_0.55_c_h/1)]
            to-[oklch(from_hsla(var(--heroui-danger))_0.25_c_h/1)]
            from-0%
            via-50%
            to-100%
            [background-size:200%_auto]
            hover:[background-position:right_center]
            transition-all
            duration-400
            `
        },
        size: {
            md: "text-sm md:text-base px-2 md:px-4 py-1 md:py-2 h-8 md:h-10"
        }
    }, 
    defaultVariants : {
        color : "danger",
        size : "md"
    }
})

export const DangerButton = forwardRef<React.ComponentRef<typeof DangerButtonConfig>, DangerButtonProps>(
    ({ children, tooltip, ...props }, ref) => {
        if (!tooltip) {
            return (
                <DangerButtonConfig ref={ref} {...props}>
                    {children}
                </DangerButtonConfig>
            )
        }

        return (
            <Tooltip content={tooltip}>
                <DangerButtonConfig ref={ref} {...props}>
                    {children}
                </DangerButtonConfig>
            </Tooltip>
        )
    }
)

DangerButton.displayName = "DangerButton"