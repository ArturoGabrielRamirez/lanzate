import { Mail } from "lucide-react"

import { Badge } from "@/features/global/components/badge/badge"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta: Meta<typeof Badge> = {
    title: "Core/Components/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "secondary", "destructive", "outline"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        shape: {
            control: "select",
            options: ["rectangle", "circle"],
        },
        showDot: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: "Badge",
        variant: "default",
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

export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-2">
            <Badge {...args} size="sm">Small</Badge>
            <Badge {...args} size="md">Medium</Badge>
            <Badge {...args} size="lg">Large</Badge>
        </div>
    ),
}

export const Shapes: Story = {
    render: (args) => (
        <div className="flex items-center gap-4">
            <Badge {...args} shape="rectangle">Rectangle Badge</Badge>
            <Badge {...args} shape="circle" className="w-6 h-6">1</Badge>
            <Badge {...args} shape="circle" className="w-8 h-8">99+</Badge>
        </div>
    ),
}

export const NotificationDot: Story = {
    args: {
        children: "Messages",
        showDot: true,
    },
}

export const OnlyDot: Story = {
    args: {
        children: null,
        showDot: true,
        className: "p-0 min-h-2 w-2 border-0 bg-transparent",
    },
}

export const CircleIcon: Story = {
    args: {
        shape: "circle",
        size: "md",
        className: "w-8 h-8",
        children: <Mail className="w-4 h-4" />,
    },
}

export const WithTooltip: Story = {
    args: {
        children: "Hover me",
        tooltip: "This is a badge tooltip!",
    },
}
