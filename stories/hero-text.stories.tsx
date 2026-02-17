
import { HeroText } from "@/features/global/components/typography/hero-text/hero-text"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/Typography/HeroText",
    component: HeroText,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["lg", "base"],
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
} satisfies Meta<typeof HeroText>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
    args: {
        size: "lg",
        children: "Hero Large Title",
    },
}

export const Base: Story = {
    args: {
        size: "base",
        children: "Hero Base Title",
    },
}
