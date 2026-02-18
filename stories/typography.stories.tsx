import { Typography } from "@/features/global/components/typography/typography/typography"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/Typography",
    component: Typography,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: [
                "h1",
                "h2",
                "h3",
                "h4",
                "p",
                "blockquote",
                "code",
                "lead",
                "large",
                "small",
                "muted",
            ],
        },
        weight: {
            control: "select",
            options: ["light", "normal", "medium", "semibold", "bold"],
        },
        align: {
            control: "select",
            options: ["left", "center", "right", "justify"],
        },
        asChild: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const H1: Story = {
    args: {
        variant: "h1",
        children: "Heading 1",
    },
}

export const H2: Story = {
    args: {
        variant: "h2",
        children: "Heading 2",
    },
}

export const H3: Story = {
    args: {
        variant: "h3",
        children: "Heading 3",
    },
}

export const H4: Story = {
    args: {
        variant: "h4",
        children: "Heading 4",
    },
}

export const P: Story = {
    args: {
        variant: "p",
        children: "The king remains satisfied with the performance of his knights.",
    },
}

export const Blockquote: Story = {
    args: {
        variant: "blockquote",
        children: "The only way to do great work is to love what you do.",
    },
}

export const Code: Story = {
    args: {
        variant: "code",
        children: "npm install @shadcn/ui",
    },
}

export const Lead: Story = {
    args: {
        variant: "lead",
        children: "A robust set of components for modern web applications.",
    },
}

export const Large: Story = {
    args: {
        variant: "large",
        children: "Are you sure you want to delete this account?",
    },
}

export const Small: Story = {
    args: {
        variant: "small",
        children: "Email address",
    },
}

export const Muted: Story = {
    args: {
        variant: "muted",
        children: "Enter your email address.",
    },
}

export const CustomWeight: Story = {
    args: {
        variant: "h1",
        weight: "bold",
        children: "Heading with Bold weight",
    },
}

export const AlignedCenter: Story = {
    args: {
        variant: "p",
        align: "center",
        children: "This text is centered.",
        className: "w-[400px]",
    },
}

export const AsSpan: Story = {
    args: {
        as: "span",
        variant: "large",
        children: "This is rendered as a span instead of the default element.",
    },
}
