import { Brand } from "@/features/global/components/brand/brand"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta: Meta<typeof Brand> = {
    title: "Core/Components/Brand",
    component: Brand,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        direction: {
            control: "radio",
            options: ["horizontal", "vertical"],
        },
        align: {
            control: "radio",
            options: ["start", "center", "end"],
        },
        color: {
            control: "radio",
            options: ["primary", "light", "dark"],
        },
        size: {
            control: "radio",
            options: ["sm", "md"],
        },
        showText: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        direction: "horizontal",
        color: "primary",
        size: "md",
        showText: true,
    },
}

export const Vertical: Story = {
    args: {
        direction: "vertical",
        align: "center",
        color: "primary",
        size: "md",
        showText: true,
    },
}

export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-6">
            <Brand {...args} size="sm" />
            <Brand {...args} size="md" />
        </div>
    ),
    args: {
        showText: true,
    },
}

export const ColorVariants: Story = {
    render: (args) => (
        <div className="flex items-center gap-6">
            <Brand {...args} color="primary" />
            <div className="rounded-lg bg-foreground p-4">
                <Brand {...args} color="light" />
            </div>
            <Brand {...args} color="dark" />
        </div>
    ),
    args: {
        showText: true,
    },
}

export const IconOnly: Story = {
    args: {
        showText: false,
        size: "md",
        color: "primary",
    },
}

export const AlignVariants: Story = {
    render: (args) => (
        <div className="flex items-start gap-8">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">start</span>
                <Brand {...args} align="start" />
            </div>
            <div className="flex flex-col gap-1 items-center">
                <span className="text-xs text-muted-foreground">center</span>
                <Brand {...args} align="center" />
            </div>
            <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-muted-foreground">end</span>
                <Brand {...args} align="end" />
            </div>
        </div>
    ),
    args: {
        direction: "vertical",
        size: "md",
        showText: true,
    },
}
