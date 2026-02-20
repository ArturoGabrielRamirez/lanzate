import {
    AlertCircle,
    BarChart2,
    Box,
    ChevronRight,
    Clock,
    Package,
    ShoppingCart,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "@/features/global/components/badge/badge"
import { Button } from "@/features/global/components/button/button"
import { Item } from "@/features/global/components/item/item"

const meta = {
    title: "Core/Components/Item",
    component: Item,
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
        layout: {
            control: "select",
            options: ["horizontal", "vertical"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        iconVariant: {
            control: "select",
            options: ["default", "primary", "secondary", "muted", "destructive", "outline", "ghost"],
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
        animate: { control: "boolean" },
        showStatusDot: { control: "boolean" },
        statusDotColor: {
            control: "select",
            options: ["success", "error", "warning", "info"],
        },
    },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        icon: <BarChart2 className="h-4 w-4" />,
        label: "Total Revenue",
        description: "Up 12% from last month",
        iconVariant: "primary",
        variant: "default",
        size: "md",
        layout: "horizontal",
    },
}

export const AllSurfaces: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-3 w-[500px]">
            {(["default", "muted", "secondary", "outline", "ghost", "destructive", "primary", "glow"] as const).map(
                (v) => (
                    <Item
                        key={v}
                        variant={v}
                        icon={<BarChart2 className="h-4 w-4" />}
                        label={v}
                        description="Surface variant"
                        iconVariant="primary"
                        size="sm"
                    />
                )
            )}
        </div>
    ),
}

export const AllIconVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-2 w-72">
            {(["default", "primary", "secondary", "muted", "destructive", "outline", "ghost"] as const).map(
                (iv) => (
                    <Item
                        key={iv}
                        variant="outline"
                        icon={<Zap className="h-4 w-4" />}
                        label={`iconVariant="${iv}"`}
                        description="Icon container color"
                        iconVariant={iv}
                        size="sm"
                    />
                )
            )}
        </div>
    ),
}

export const HorizontalLayouts: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-80">
            {(["sm", "md", "lg"] as const).map((s) => (
                <Item
                    key={s}
                    size={s}
                    variant="default"
                    layout="horizontal"
                    icon={<Users className="h-4 w-4" />}
                    label="Team members"
                    description="8 active users"
                    iconVariant="secondary"
                />
            ))}
        </div>
    ),
}

export const VerticalLayouts: Story = {
    render: () => (
        <div className="flex items-start gap-4">
            {(["sm", "md", "lg"] as const).map((s) => (
                <Item
                    key={s}
                    size={s}
                    variant="default"
                    layout="vertical"
                    icon={<Star className="h-4 w-4" />}
                    label="4.9"
                    description="Rating"
                    iconVariant="primary"
                    className="w-24"
                />
            ))}
        </div>
    ),
}

export const WithSuffix: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-80">
            <Item
                variant="default"
                icon={<Users className="h-4 w-4" />}
                label="Team Members"
                description="Last updated 2h ago"
                iconVariant="secondary"
                suffix={<Badge variant="secondary" size="sm">+3</Badge>}
            />
            <Item
                variant="default"
                icon={<TrendingUp className="h-4 w-4" />}
                label="Conversion Rate"
                description="vs last month"
                iconVariant="primary"
                suffix={<span className="text-sm font-semibold text-green-600">+12%</span>}
            />
            <Item
                variant="outline"
                icon={<ShoppingCart className="h-4 w-4" />}
                label="Pending Orders"
                description="Requires review"
                iconVariant="destructive"
                suffix={
                    <Button size="xs" variant="ghost">
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                }
            />
        </div>
    ),
}

export const StatGrid: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-3 w-[400px]">
            {[
                { label: "1,240", desc: "Orders", icon: <ShoppingCart className="h-4 w-4" />, iv: "primary" as const },
                { label: "843", desc: "Users", icon: <Users className="h-4 w-4" />, iv: "secondary" as const },
                { label: "4.9", desc: "Rating", icon: <Star className="h-4 w-4" />, iv: "default" as const },
                { label: "$14.2k", desc: "Revenue", icon: <TrendingUp className="h-4 w-4" />, iv: "primary" as const },
                { label: "96%", desc: "Uptime", icon: <Zap className="h-4 w-4" />, iv: "muted" as const },
                { label: "240", desc: "Products", icon: <Package className="h-4 w-4" />, iv: "outline" as const },
            ].map((stat) => (
                <Item
                    key={stat.desc}
                    layout="vertical"
                    variant="default"
                    size="md"
                    icon={stat.icon}
                    label={stat.label}
                    description={stat.desc}
                    iconVariant={stat.iv}
                    rounded="xl"
                />
            ))}
        </div>
    ),
}

export const EmptyState: Story = {
    args: {
        variant: "outline",
        rounded: "xl",
        padding: "lg",
        className: "w-64",
    },
}

export const WithStatusDot: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-72">
            {(["success", "error", "warning", "info"] as const).map((color) => (
                <Item
                    key={color}
                    variant="default"
                    icon={<Users className="h-4 w-4" />}
                    label="Live connection"
                    description={`Status: ${color}`}
                    iconVariant="default"
                    showStatusDot
                    statusDotColor={color}
                    size="sm"
                />
            ))}
        </div>
    ),
}

export const Interactive: Story = {
    render: () => (
        <div className="flex flex-col gap-2 w-72">
            {[
                { label: "View analytics", desc: "Open dashboard", icon: <BarChart2 className="h-4 w-4" /> },
                { label: "Manage team", desc: "8 members", icon: <Users className="h-4 w-4" /> },
                { label: "Order history", desc: "Last 30 days", icon: <Clock className="h-4 w-4" /> },
            ].map((item) => (
                <Item
                    key={item.label}
                    asChild
                    variant="ghost"
                    hover="default"
                    interactive
                    icon={item.icon}
                    label={item.label}
                    description={item.desc}
                    iconVariant="primary"
                    size="sm"
                    padding="sm"
                    rounded="md"
                >
                    <a href="#" onClick={(e) => e.preventDefault()} />
                </Item>
            ))}
        </div>
    ),
}

export const Animated: Story = {
    render: () => (
        <div className="flex flex-col gap-2 w-72">
            {[
                { label: "Revenue", desc: "$14,820", icon: <TrendingUp className="h-4 w-4" /> },
                { label: "Orders", desc: "1,240 this month", icon: <ShoppingCart className="h-4 w-4" /> },
                { label: "Customers", desc: "843 active", icon: <Users className="h-4 w-4" /> },
                { label: "Products", desc: "240 listed", icon: <Box className="h-4 w-4" /> },
                { label: "Alerts", desc: "2 need attention", icon: <AlertCircle className="h-4 w-4" /> },
            ].map((item, i) => (
                <Item
                    key={item.label}
                    variant="default"
                    icon={item.icon}
                    label={item.label}
                    description={item.desc}
                    iconVariant="primary"
                    animate
                    style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
                />
            ))}
        </div>
    ),
}

export const Playground: Story = {
    parameters: {
        controls: {
            include: [
                "variant",
                "hover",
                "layout",
                "size",
                "iconVariant",
                "padding",
                "rounded",
                "interactive",
                "animate",
                "showStatusDot",
                "statusDotColor",
            ],
        },
    },
    args: {
        icon: <BarChart2 className="h-4 w-4" />,
        label: "Metric label",
        description: "Supporting description",
        iconVariant: "primary",
        variant: "default",
        layout: "horizontal",
        size: "md",
        padding: "md",
        rounded: "lg",
        hover: "none",
        interactive: false,
        animate: false,
        showStatusDot: false,
        statusDotColor: "success",
    },
}
