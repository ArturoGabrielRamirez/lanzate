
import { Title } from "@/features/global/components/typography/title/title"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/Typography/Title",
    component: Title,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["lg", "md", "sm"],
        },
        weight: {
            control: "select",
            options: ["light", "normal", "medium", "semibold", "bold"],
        },
        align: {
            control: "select",
            options: ["left", "center", "right", "justify"],
        },
    },
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
    args: {
        size: "lg",
        children: "Section Title Large",
    },
}

export const Medium: Story = {
    args: {
        size: "md",
        children: "Section Title Medium",
    },
}

export const Small: Story = {
    args: {
        size: "sm",
        children: "Section Title Small",
    },
}
