
import { Bell, Pencil, Share2, UserPlus } from "lucide-react"
import * as React from "react"


import { EntityBanner } from "@/features/global/components/entity-banner/entity-banner"
import { Text } from "@/features/global/components/typography/text/text"
import { Title } from "@/features/global/components/typography/title/title"

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

const meta = {
    title: "Core/Components/EntityBanner",
    component: EntityBanner,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["base", "lg"],
        },
        avatarPosition: {
            control: "select",
            options: ["inside", "overlap-bottom"],
        },
        showAvatar: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof EntityBanner>

export default meta
type Story = StoryObj<typeof meta>

const defaultAvatar = {
    src: "https://github.com/shadcn.png",
    alt: "Store Owner",
    fallback: "SO",
}

function AutoCompactOnScrollPreview(args: React.ComponentProps<typeof EntityBanner>) {
    const anchorRef = React.useRef<HTMLDivElement | null>(null)
    const [showFloating, setShowFloating] = React.useState(false)

    React.useEffect(() => {
        const node = anchorRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloating(!entry.isIntersecting)
            },
            {
                threshold: 0.05,
                rootMargin: "-8px 0px 0px 0px",
            }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="w-full p-6">
            <style>
                {`@keyframes bannerDropIn {
                    0% { transform: translateY(-125%); opacity: 1; }
                    62% { transform: translateY(11%); opacity: 1; }
                    78% { transform: translateY(-4%); opacity: 1; }
                    90% { transform: translateY(2%); opacity: 1; }
                    100% { transform: translateY(0); opacity: 1; }
                }`}
            </style>

            <div className="min-h-[220vh] space-y-8">
                <div ref={anchorRef}>
                    <EntityBanner {...args} />
                </div>

                {showFloating ? (
                    <div className="pointer-events-none fixed inset-x-6 top-3 z-40">
                        <EntityBanner
                            {...args}
                            className="pointer-events-auto will-change-transform animate-[bannerDropIn_520ms_cubic-bezier(0.22,1.12,0.3,1)]"
                            bannerClassName="border-border/70 bg-background supports-[backdrop-filter]:bg-background/90 backdrop-blur-lg shadow-md"
                        />
                    </div>
                ) : null}

                <div className="-mt-4 grid gap-4 pt-4 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                        <Title size="sm" className="border-b-0 pb-0">Orders Summary</Title>
                        <Text size="sm" className="not-first:mt-2">
                            Scroll down: the original banner goes up with content.
                        </Text>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                        <Title size="sm" className="border-b-0 pb-0">Campaigns</Title>
                        <Text size="sm" className="not-first:mt-2">
                            Once hidden, a floating banner drops from top with bounce.
                        </Text>
                    </div>
                </div>

                <div className="h-[140vh] rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
                    <Text size="sm">Scroll area</Text>
                </div>
            </div>
        </div>
    )
}

export const Default: Story = {
    args: {
        title: "Urban Craft Store",
        description: "Manage your catalog, orders and promotions from one place.",
        size: "base",
        avatarPosition: "inside",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const Large: Story = {
    args: {
        title: "Public Profile",
        description: "Creator and curator of handmade products.",
        size: "lg",
        avatarPosition: "inside",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const WithActions: Story = {
    args: {
        title: "Store Dashboard",
        description: "Review store health and complete pending tasks.",
        size: "base",
        avatarPosition: "inside",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
        actionItems: [
            {
                label: "View public profile",
                icon: <Bell className="h-4 w-4" />,
                buttonProps: { variant: "outline" },
            },
            {
                label: "Edit store",
                icon: <Pencil className="h-4 w-4" />,
                buttonProps: { variant: "default" },
            },
        ],
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const AvatarOverlapBottom: Story = {
    args: {
        title: "Sofia Martinez",
        description: "Public profile header with avatar overlap style.",
        size: "lg",
        avatarPosition: "overlap-bottom",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
        avatar: { status: "success" },
        actionItems: [
            {
                label: "Share profile",
                icon: <Share2 className="h-4 w-4" />,
                buttonProps: { variant: "outline" },
            },
            {
                label: "Follow profile",
                icon: <UserPlus className="h-4 w-4" />,
                buttonProps: { variant: "default" },
            },
        ],
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const CustomContentNodes: Story = {
    args: {
        size: "base",
        avatarPosition: "inside",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
        titleNode: (
            <Title size="md">
                Verified Seller <span className="text-primary">@urbancraft</span>
            </Title>
        ),
        descriptionNode: (
            <Text size="base">
                4.9 rating, 1.2k reviews, ships in 24h.
            </Text>
        ),
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const WithoutAvatar: Story = {
    args: {
        title: "Admin Workspace",
        description: "A generic banner without avatar, useful for system-level screens.",
        size: "base",
        showAvatar: false,
        actionItems: [
            {
                label: "Export report",
                icon: <Share2 className="h-4 w-4" />,
                buttonProps: { variant: "outline" },
            },
            {
                label: "Create report",
                icon: <Pencil className="h-4 w-4" />,
                buttonProps: { variant: "default" },
            },
        ],
    },
    render: (args) => (
        <div className="w-full p-6">
            <EntityBanner {...args} />
        </div>
    ),
}

export const AutoCompactOnScroll: Story = {
    args: {
        title: "Store Dashboard",
        description: "Scroll down to see the banner compact mode kick in.",
        size: "lg",
        avatarPosition: "overlap-bottom",
        showAvatar: true,
        avatarSrc: defaultAvatar.src,
        avatarAlt: defaultAvatar.alt,
        avatarFallback: defaultAvatar.fallback,
        autoCompactOnScroll: true,
        compactOnScrollThreshold: 24,
        actionItems: [
            {
                label: "View public profile",
                icon: <Bell className="h-4 w-4" />,
                buttonProps: { variant: "outline" },
            },
            {
                label: "Edit store",
                icon: <Pencil className="h-4 w-4" />,
                buttonProps: { variant: "default" },
            },
        ],
    },
    render: (args) => <AutoCompactOnScrollPreview {...args} />,
}
