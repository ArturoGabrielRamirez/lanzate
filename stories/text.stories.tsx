
import { Text } from "@/features/global/components/typography/text/text"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/Typography/Text",
    component: Text,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["lg", "base", "sm", "xs"],
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
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
    args: {
        size: "lg",
        children: "Body text large",
    },
}

export const Base: Story = {
    args: {
        size: "base",
        children: "Body text base",
    },
}

export const Small: Story = {
    args: {
        size: "sm",
        children: "Body text small",
    },
}

export const ExtraSmall: Story = {
    args: {
        size: "xs",
        children: "Body text extra small (muted)",
    },
}
