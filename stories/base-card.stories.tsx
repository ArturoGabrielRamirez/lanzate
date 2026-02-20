import {
    BarChart2,
    Building2,
    Calendar,
    CheckCircle2,
    Crown,
    Lock,
    Mail,
    MapPin,
    MoreHorizontal,
    Package,
    ShoppingCart,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react"
import Link from "next/link"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "@/features/global/components/badge/badge"
import {
    BaseCard,
    BaseCardContent,
    BaseCardFooter,
    BaseCardHeader,
} from "@/features/global/components/base-card"
import { Button } from "@/features/global/components/button/button"
import { Item } from "@/features/global/components/item/item"

const meta = {
    title: "Core/Components/BaseCard",
    component: BaseCard,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "muted", "secondary", "outline", "ghost", "destructive", "primary", "glow"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        rounded: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
        hover: {
            control: "select",
            options: ["none", "default", "muted", "primary"],
        },
        divided: { control: "boolean" },
    },
} satisfies Meta<typeof BaseCard>

export default meta
type Story = StoryObj<typeof meta>

// ─── Basic ───────────────────────────────────────────────────────────────────

export const Default: Story = {
    render: (args) => (
        <BaseCard {...args} className="w-80">
            <BaseCardHeader
                title="Monthly Revenue"
                description="Revenue for the current billing period"
            />
            <BaseCardContent>
                <p className="text-3xl font-bold tracking-tight">$14,820</p>
                <p className="mt-1 text-xs text-muted-foreground">+12% from last month</p>
            </BaseCardContent>
            <BaseCardFooter>
                <span className="text-xs text-muted-foreground">Updated just now</span>
                <Button size="sm" variant="outline">
                    View details
                </Button>
            </BaseCardFooter>
        </BaseCard>
    ),
    args: { size: "md", variant: "default" },
}

export const HeaderOnly: Story = {
    render: () => (
        <BaseCard className="w-80">
            <BaseCardHeader
                title="Section title"
                description="Only the header — no content or footer needed"
            />
        </BaseCard>
    ),
}

export const MinimalCard: Story = {
    render: () => (
        <BaseCard className="w-72">
            <BaseCardContent>
                <p className="text-sm text-muted-foreground">
                    Just a content area with no header or footer. Pure minimal.
                </p>
            </BaseCardContent>
        </BaseCard>
    ),
}

// ─── Header Slots ────────────────────────────────────────────────────────────

export const WithAction: Story = {
    render: () => (
        <BaseCard className="w-80">
            <BaseCardHeader
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart2 className="h-4 w-4 text-primary" />
                    </div>
                }
                title="Analytics Overview"
                description="Last 7 days performance"
                action={
                    <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
            />
            <BaseCardContent>
                <div className="flex h-24 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                    Chart placeholder
                </div>
            </BaseCardContent>
        </BaseCard>
    ),
}

export const WithMeta: Story = {
    render: () => (
        <BaseCard className="w-80">
            <BaseCardHeader
                title="Product launch campaign"
                description="Cross-channel campaign performance"
                action={
                    <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
                meta={
                    <>
                        <Badge variant="secondary" size="sm">Q4 2024</Badge>
                        <Badge variant="outline" size="sm">Live</Badge>
                        <Badge size="sm">+18%</Badge>
                    </>
                }
            />
            <BaseCardContent>
                <div className="flex h-20 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                    Metrics
                </div>
            </BaseCardContent>
        </BaseCard>
    ),
}

export const WithIcon: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            {[
                { title: "Orders", desc: "1,240 this month", icon: <ShoppingCart className="h-4 w-4 text-primary" /> },
                { title: "Customers", desc: "843 active users", icon: <Users className="h-4 w-4 text-primary" /> },
                { title: "Revenue", desc: "$14,820 total", icon: <TrendingUp className="h-4 w-4 text-primary" /> },
            ].map((item) => (
                <BaseCard key={item.title} size="sm" className="w-72">
                    <BaseCardHeader
                        icon={
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                                {item.icon}
                            </div>
                        }
                        title={item.title}
                        description={item.desc}
                    />
                </BaseCard>
            ))}
        </div>
    ),
}

// ─── Divided ─────────────────────────────────────────────────────────────────

export const Divided: Story = {
    render: () => (
        <BaseCard divided className="w-80">
            <BaseCardHeader
                title="Account Settings"
                description="Manage your preferences and security"
            />
            <BaseCardContent>
                <p className="text-sm text-muted-foreground">
                    Content area — note the border separating it from the header above.
                </p>
            </BaseCardContent>
            <BaseCardFooter align="end">
                <Button size="sm" variant="outline">
                    Cancel
                </Button>
                <Button size="sm">Save changes</Button>
            </BaseCardFooter>
        </BaseCard>
    ),
}

// ─── Surface Variants ────────────────────────────────────────────────────────

export const AllVariants: Story = {
    render: () => (
        <div className="grid grid-cols-2 gap-4 w-[600px]">
            {(["default", "muted", "secondary", "outline", "ghost", "destructive", "primary", "glow"] as const).map(
                (v) => (
                    <BaseCard key={v} variant={v} size="sm">
                        <BaseCardHeader title={v} description="Surface variant" />
                        <BaseCardContent>
                            <div className="h-8 rounded-md bg-muted/50" />
                        </BaseCardContent>
                    </BaseCard>
                )
            )}
        </div>
    ),
}

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-start gap-4">
            {(["sm", "md", "lg"] as const).map((s) => (
                <BaseCard key={s} size={s} className="w-56">
                    <BaseCardHeader title={`size="${s}"`} description="Padding scale" />
                    <BaseCardContent>
                        <div className="h-10 rounded-md bg-muted" />
                    </BaseCardContent>
                    <BaseCardFooter align="end">
                        <Button size="sm" variant="outline">
                            Action
                        </Button>
                    </BaseCardFooter>
                </BaseCard>
            ))}
        </div>
    ),
}

// ─── Footer Alignment ────────────────────────────────────────────────────────

export const FooterAlign: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-80">
            {(["start", "center", "between", "end"] as const).map((align) => (
                <BaseCard key={align} size="sm" divided>
                    <BaseCardHeader title={`align="${align}"`} />
                    <BaseCardFooter align={align}>
                        <Button size="sm" variant="outline">
                            Cancel
                        </Button>
                        <Button size="sm">Save</Button>
                    </BaseCardFooter>
                </BaseCard>
            ))}
        </div>
    ),
}

// ─── Glow ────────────────────────────────────────────────────────────────────

export const GlowVariant: Story = {
    render: () => (
        <div className="flex flex-col items-center gap-6 p-8">
            <BaseCard variant="glow" size="md" className="w-80">
                <BaseCardHeader
                    icon={
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                            <Crown className="h-5 w-5 text-primary" />
                        </div>
                    }
                    title="Upgrade to Pro"
                    description="Unlock unlimited access to all features"
                    meta={
                        <>
                            <Badge variant="default" size="sm">
                                <Sparkles className="mr-1 h-2.5 w-2.5" />
                                Most popular
                            </Badge>
                        </>
                    }
                />
                <BaseCardContent>
                    <ul className="space-y-1.5">
                        {[
                            "Unlimited products",
                            "Advanced analytics",
                            "Priority support",
                            "Custom domain",
                        ].map((feat) => (
                            <li key={feat} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                </BaseCardContent>
                <BaseCardFooter align="center">
                    <Button className="w-full" canGlow>
                        <Zap className="mr-1.5 h-4 w-4" />
                        Upgrade now — $29/mo
                    </Button>
                </BaseCardFooter>
            </BaseCard>
        </div>
    ),
}

// ─── AsChild (link card) ─────────────────────────────────────────────────────

export const AsChildCard: Story = {
    render: () => (
        <BaseCard
            asChild
            variant="outline"
            hover="default"
            className="w-72 cursor-pointer"
        >
            <Link href="#" onClick={(e) => e.preventDefault()}>
                <BaseCardHeader
                    icon={
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                    }
                    title="Product catalog"
                    description="Navigate to the full catalog"
                    action={<ChevronRightIcon />}
                />
            </Link>
        </BaseCard>
    ),
}

function ChevronRightIcon() {
    return (
        <div className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
            >
                <path d="m9 18 6-6-6-6" />
            </svg>
        </div>
    )
}

// ─── Nested Items ────────────────────────────────────────────────────────────

export const NestedItems: Story = {
    render: () => (
        <BaseCard divided className="w-80">
            <BaseCardHeader
                title="Quick stats"
                description="This week at a glance"
                action={
                    <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
            />
            <BaseCardContent className="flex flex-col gap-1 p-2">
                {[
                    {
                        label: "Orders",
                        desc: "1,240 placed",
                        icon: <ShoppingCart className="h-3.5 w-3.5" />,
                        suffix: <Badge variant="secondary" size="sm">+8%</Badge>,
                        iv: "primary" as const,
                    },
                    {
                        label: "New customers",
                        desc: "84 signed up",
                        icon: <Users className="h-3.5 w-3.5" />,
                        suffix: <Badge variant="secondary" size="sm">+3%</Badge>,
                        iv: "secondary" as const,
                    },
                    {
                        label: "Revenue",
                        desc: "$14,820 total",
                        icon: <TrendingUp className="h-3.5 w-3.5" />,
                        suffix: <Badge variant="secondary" size="sm">+12%</Badge>,
                        iv: "primary" as const,
                    },
                    {
                        label: "Uptime",
                        desc: "99.98% SLA",
                        icon: <Zap className="h-3.5 w-3.5" />,
                        suffix: <Badge size="sm">Live</Badge>,
                        iv: "muted" as const,
                    },
                ].map((item) => (
                    <Item
                        key={item.label}
                        variant="ghost"
                        hover="default"
                        interactive
                        size="sm"
                        padding="sm"
                        rounded="md"
                        icon={item.icon}
                        label={item.label}
                        description={item.desc}
                        iconVariant={item.iv}
                        suffix={item.suffix}
                    />
                ))}
            </BaseCardContent>
            <BaseCardFooter align="end">
                <Button size="sm" variant="ghost">
                    View all
                </Button>
            </BaseCardFooter>
        </BaseCard>
    ),
}

// ─── Locked/Empty ────────────────────────────────────────────────────────────

export const LockedFeature: Story = {
    render: () => (
        <BaseCard variant="muted" size="md" className="w-72 opacity-70">
            <BaseCardHeader
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted-foreground/10">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                }
                title="Advanced reports"
                description="Available on Pro plan"
            />
            <BaseCardContent>
                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                    Upgrade to unlock
                </div>
            </BaseCardContent>
            <BaseCardFooter align="center">
                <Button size="sm" variant="outline" className="w-full">
                    <Crown className="mr-1.5 h-3.5 w-3.5" />
                    Upgrade plan
                </Button>
            </BaseCardFooter>
        </BaseCard>
    ),
}

export const EventCard: Story = {
    render: () => (
        <BaseCard variant="default" size="md" className="w-72">
            <BaseCardHeader
                icon={
                    <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 leading-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Jul</span>
                        <span className="text-lg font-bold leading-none text-primary">24</span>
                    </div>
                }
                title="Team sync meeting"
                description="10:00 AM — 11:00 AM"
                action={
                    <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
                meta={
                    <>
                        <Badge variant="outline" size="sm">
                            <Calendar className="mr-1 h-2.5 w-2.5" />
                            Weekly
                        </Badge>
                        <Badge variant="secondary" size="sm">8 attendees</Badge>
                    </>
                }
            />
        </BaseCard>
    ),
}

// ─── Row Layout ──────────────────────────────────────────────────────────────

export const RowLayout: Story = {
    render: () => (
        <BaseCard layout="row" divided size="sm" className="w-160">
            <BaseCardHeader
                icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-4 w-4 text-primary" />
                    </div>
                }
                title="Product name"
                description="SKU-0012 · Electronics"
            />
            <BaseCardContent>
                <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" size="sm">In stock</Badge>
                    <span className="text-xs text-muted-foreground">240 units</span>
                </div>
            </BaseCardContent>
            <BaseCardFooter align="end">
                <span className="text-sm font-semibold">$49.99</span>
                <Button size="sm" variant="outline">Edit</Button>
            </BaseCardFooter>
        </BaseCard>
    ),
}

// ─── Table Rows ──────────────────────────────────────────────────────────────

const tableData = [
    {
        name: "Acme Corp",
        subtitle: "acme.com",
        icon: <Building2 className="h-3.5 w-3.5 text-primary" />,
        tag: "Enterprise",
        tagVariant: "default" as const,
        contact: "Sarah Johnson",
        location: "San Francisco, CA",
        score: 98,
    },
    {
        name: "Globex Inc",
        subtitle: "globex.io",
        icon: <Building2 className="h-3.5 w-3.5 text-muted-foreground" />,
        tag: "Pro",
        tagVariant: "secondary" as const,
        contact: "Mike Chen",
        location: "Austin, TX",
        score: 87,
    },
    {
        name: "Initech Ltd",
        subtitle: "initech.dev",
        icon: <Building2 className="h-3.5 w-3.5 text-muted-foreground" />,
        tag: "Starter",
        tagVariant: "outline" as const,
        contact: "Ana Lima",
        location: "New York, NY",
        score: 74,
    },
    {
        name: "Umbrella Co",
        subtitle: "umbrella.com",
        icon: <Building2 className="h-3.5 w-3.5 text-destructive" />,
        tag: "Churned",
        tagVariant: "destructive" as const,
        contact: "Tom Walker",
        location: "Chicago, IL",
        score: 31,
    },
    {
        name: "Wonka Ltd",
        subtitle: "wonka.shop",
        icon: <Building2 className="h-3.5 w-3.5 text-primary" />,
        tag: "Pro",
        tagVariant: "secondary" as const,
        contact: "Lily Park",
        location: "Seattle, WA",
        score: 92,
    },
]

export const TableRows: Story = {
    render: () => (
        <div className="flex w-190 flex-col gap-1.5">
            {/* Header row */}
            <div className="flex items-center px-4 py-1.5">
                <span className="flex-1 min-w-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Company
                </span>
                <span className="flex-1 min-w-0 text-xs font-medium uppercase tracking-wider text-muted-foreground px-5">
                    Contact
                </span>
                <span className="flex-1 min-w-0 text-xs font-medium uppercase tracking-wider text-muted-foreground px-5">
                    Location
                </span>
                <div className="shrink-0 w-30 text-xs font-medium uppercase tracking-wider text-muted-foreground px-5">
                    Score
                </div>
            </div>

            {tableData.map((row) => (
                <BaseCard
                    key={row.name}
                    layout="row"
                    divided
                    size="sm"
                    variant="default"
                    hover="default"
                    columnGap="none"
                >
                    {/* Column 1: company name */}
                    <BaseCardHeader
                        icon={
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                                {row.icon}
                            </div>
                        }
                        title={row.name}
                        description={row.subtitle}
                        meta={<Badge variant={row.tagVariant} size="sm">{row.tag}</Badge>}
                    />

                    {/* Column 2: contact */}
                    <BaseCardContent className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-foreground truncate">{row.contact}</span>
                    </BaseCardContent>

                    {/* Column 3: location */}
                    <BaseCardContent className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">{row.location}</span>
                    </BaseCardContent>

                    {/* Column 4 (footer = actions column) */}
                    <BaseCardFooter align="between" className="w-30 flex-none">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            <span className="text-sm font-semibold">{row.score}</span>
                        </div>
                        <Button size="icon-sm" variant="ghost">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                    </BaseCardFooter>
                </BaseCard>
            ))}
        </div>
    ),
}

// ─── Column Gap ──────────────────────────────────────────────────────────────

export const ColumnGap: Story = {
    render: () => (
        <div className="flex flex-col gap-3 w-170">
            {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
                <div key={gap} className="flex flex-col gap-1">
                    <p className="text-xs font-mono text-muted-foreground ml-1">
                        columnGap="{gap}"
                    </p>
                    <BaseCard
                        layout="row"
                        columnGap={gap}
                        divided
                        size="sm"
                        variant="outline"
                    >
                        <BaseCardHeader
                            title="Header column"
                            description="Primary info"
                        />
                        <BaseCardContent>
                            <span className="text-sm text-muted-foreground">Content column</span>
                        </BaseCardContent>
                        <BaseCardFooter align="end">
                            <Button size="sm" variant="ghost">Action</Button>
                        </BaseCardFooter>
                    </BaseCard>
                </div>
            ))}
        </div>
    ),
}

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
    parameters: {
        controls: {
            include: ["variant", "size", "rounded", "hover", "divided", "layout", "columnGap"],
        },
    },
    render: (args) => (
        <BaseCard {...args} className="w-80">
            <BaseCardHeader
                title="Card title"
                description="Card description goes here"
                action={
                    <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                }
            />
            <BaseCardContent>
                <div className="flex h-20 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                    Content area
                </div>
            </BaseCardContent>
            <BaseCardFooter>
                <span className="text-xs text-muted-foreground">Footer text</span>
                <Button size="sm">Action</Button>
            </BaseCardFooter>
        </BaseCard>
    ),
    args: {
        variant: "default",
        size: "md",
        rounded: "xl",
        hover: "none",
        divided: false,
    },
}
