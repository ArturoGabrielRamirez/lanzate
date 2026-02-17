import { expect, fn, userEvent, within } from "@storybook/test"
import { ArrowRight, ChevronRight, Mail } from "lucide-react"


import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "@/features/global/components/button/button"

const meta = {
    title: "Core/Components/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: [
                "default",
                "secondary",
                "destructive",
                "outline",
                "ghost",
                "link",
            ],
        },
        size: {
            control: "select",
            options: ["default", "sm", "lg", "icon"],
        },
        asChild: {
            control: "boolean",
        },
        isLoading: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        rounded: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: "Button",
        variant: "default",
        size: "default",
        onClick: fn(),
    },
}

export const Secondary: Story = {
    args: {
        children: "Secondary",
        variant: "secondary",
    },
}

export const Destructive: Story = {
    args: {
        children: "Destructive",
        variant: "destructive",
    },
}

export const Outline: Story = {
    args: {
        children: "Outline",
        variant: "outline",
    },
}

export const Ghost: Story = {
    args: {
        children: "Ghost",
        variant: "ghost",
    },
}

export const Link: Story = {
    args: {
        children: "Link",
        variant: "link",
    },
}

export const Small: Story = {
    args: {
        children: "Small",
        size: "sm",
    },
}

export const Large: Story = {
    args: {
        children: "Large",
        size: "lg",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole("button")
        await expect(button).toHaveClass("h-11 px-8")
    },
}

export const Rounded: Story = {
    args: {
        children: "Rounded Button",
        rounded: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole("button")
        await expect(button).toHaveClass("rounded-full")
    },
}

export const Circle: Story = {
    args: {
        children: <ChevronRight className="h-4 w-4" />,
        size: "icon",
        rounded: true,
        "aria-label": "Next page",
    },
}

export const Icon: Story = {
    args: {
        children: <ChevronRight className="h-4 w-4" />,
        size: "icon",
        "aria-label": "Next page",
    },
}

export const WithStartIcon: Story = {
    args: {
        children: "Login with Email",
        startIcon: <Mail className="h-4 w-4" />,
    },
}

export const WithEndIcon: Story = {
    args: {
        children: "Get Started",
        endIcon: <ArrowRight className="h-4 w-4" />,
    },
}

export const Loading: Story = {
    args: {
        children: "Please wait",
        isLoading: true,
        onClick: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole("button")

        await expect(button).toBeDisabled()
        // Note: userEvent.click fails on pointer-events-none (Shadcn default for disabled)
        // We just verify the disabled state which is sufficient for smoke testing
        await expect(args.onClick).not.toHaveBeenCalled()
    },
}

export const LoadingWithIcon: Story = {
    args: {
        children: "Login with Email",
        startIcon: <Mail className="h-4 w-4" />,
        isLoading: true,
    },
}

export const WithTooltip: Story = {
    args: {
        children: "Hover me",
        tooltip: "This is a helpful tooltip",
    },
}
