import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { BaseSurface } from "@/features/global/components/base-surface/base-surface"

const meta = {
    title: "Core/Components/BaseSurface",
    component: BaseSurface,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "muted", "secondary", "outline", "ghost", "destructive", "primary", "glow"],
        },
        hover: {
            control: "select",
            options: ["none", "default", "muted", "primary"],
        },
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
        },
        rounded: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
        interactive: { control: "boolean" },
        asChild: { control: "boolean" },
    },
} satisfies Meta<typeof BaseSurface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        variant: "default",
        padding: "md",
        rounded: "lg",
        children: (
            <p className="text-sm text-foreground">Surface content — any children here</p>
        ),
    },
}

export const AllVariants: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-3 w-[480px]">
            {(["default", "muted", "secondary", "outline", "ghost", "destructive", "primary", "glow"] as const).map(
                (v) => (
                    <BaseSurface key={v} variant={v} padding="md" rounded="lg">
                        <p className="text-xs font-medium text-foreground capitalize">{v}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Surface variant</p>
                    </BaseSurface>
                )
            )}
        </div>
    ),
}

export const HoverStates: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-72">
            <p className="text-xs text-muted-foreground mb-1">Hover over each surface</p>
            {(["none", "default", "muted", "primary"] as const).map((h) => (
                <BaseSurface key={h} variant="outline" hover={h} padding="md" rounded="lg">
                    <p className="text-xs font-medium capitalize">hover="{h}"</p>
                </BaseSurface>
            ))}
        </div>
    ),
}

export const Padding: Story = {
    render: () => (
        <div className="flex items-start gap-3">
            {(["none", "sm", "md", "lg"] as const).map((p) => (
                <BaseSurface key={p} variant="outline" padding={p} rounded="lg">
                    <div className="bg-primary/20 rounded text-xs px-1 py-0.5 font-mono whitespace-nowrap">
                        {p}
                    </div>
                </BaseSurface>
            ))}
        </div>
    ),
}

export const Rounded: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            {(["sm", "md", "lg", "xl"] as const).map((r) => (
                <BaseSurface key={r} variant="default" padding="md" rounded={r}>
                    <p className="text-xs font-mono">{r}</p>
                </BaseSurface>
            ))}
        </div>
    ),
}

export const Interactive: Story = {
    args: {
        variant: "default",
        hover: "default",
        padding: "md",
        rounded: "lg",
        interactive: true,
        children: (
            <div className="text-sm">
                <p className="font-medium">Click me</p>
                <p className="text-xs text-muted-foreground mt-0.5">interactive + hover="default"</p>
            </div>
        ),
    },
}

export const AsChildLink: Story = {
    render: () => (
        <BaseSurface
            asChild
            variant="primary"
            padding="md"
            rounded="lg"
            interactive
            hover="primary"
        >
            <a href="#" onClick={(e) => e.preventDefault()}>
                <p className="text-sm font-medium text-primary">Link wrapped in BaseSurface</p>
                <p className="text-xs text-muted-foreground mt-0.5">asChild — no extra div wrapper</p>
            </a>
        </BaseSurface>
    ),
}

export const GlowVariant: Story = {
    render: () => (
        <div className="flex flex-col items-center gap-6 p-8">
            <BaseSurface variant="glow" padding="lg" rounded="xl" className="w-72">
                <p className="text-sm font-semibold text-foreground">Glow surface</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Layered ring + ambient shadow using the primary brand color
                </p>
            </BaseSurface>
        </div>
    ),
}

export const Playground: Story = {
    parameters: {
        controls: {
            include: ["variant", "hover", "padding", "rounded", "interactive"],
        },
    },
    args: {
        variant: "default",
        hover: "none",
        padding: "md",
        rounded: "lg",
        interactive: false,
        children: (
            <div>
                <p className="text-sm font-medium">Playground</p>
                <p className="text-xs text-muted-foreground mt-0.5">Use the controls to explore</p>
            </div>
        ),
    },
}
