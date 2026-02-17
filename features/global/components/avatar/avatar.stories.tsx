import { Avatar } from "./avatar"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta: Meta<typeof Avatar> = {
    title: "Core/components/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
        shape: {
            control: "select",
            options: ["circle", "square"],
        },
        status: {
            control: "select",
            options: ["none", "success", "error", "custom"],
        },
    },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
    args: {
        src: "https://github.com/shadcn.png",
        alt: "User",
        size: "md",
        shape: "circle",
    },
}

export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-4">
            <Avatar size="sm" src="https://github.com/shadcn.png" alt="Small" />
            <Avatar size="md" src="https://github.com/shadcn.png" alt="Medium" />
            <Avatar size="lg" src="https://github.com/shadcn.png" alt="Large" />
            <Avatar size="xl" src="https://github.com/shadcn.png" alt="Extra Large" />
        </div>
    ),
}

export const Shapes: Story = {
    render: () => (
        <div className="flex gap-4">
            <Avatar shape="circle" src="https://github.com/shadcn.png" alt="Circle" />
            <Avatar shape="square" src="https://github.com/shadcn.png" alt="Square" />
        </div>
    ),
}

export const Statuses: Story = {
    args: {
        shape: "square"
    },

    render: () => (
        <div className="flex gap-4">
            <Avatar status="success" src="https://github.com/shadcn.png" alt="Success" shape="square" />
            <Avatar status="success" src="https://github.com/shadcn.png" alt="Success" />
            <Avatar status="error" src="https://github.com/shadcn.png" alt="Error" />
            <Avatar status="custom" statusColor="#eab308" src="https://github.com/shadcn.png" alt="Custom" />
        </div>
    )
}

export const WithBadge: Story = {
    args: {
        src: "https://github.com/shadcn.png",
        alt: "User",
        badge: {
            text: "1",
            variant: "destructive",
            size: "sm",
            shape: "circle",
        },
    },
}

export const WithTooltip: Story = {
    args: {
        src: "https://github.com/shadcn.png",
        alt: "User",
        tooltip: "User Profile",
    },
}

export const Fallback: Story = {
    args: {
        src: "invalid-url",
        alt: "JD",
        fallback: "JD",
    },
}
