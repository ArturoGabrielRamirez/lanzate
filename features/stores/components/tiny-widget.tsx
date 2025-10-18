import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Link } from "@/i18n/naviation"

interface TinyWidgetProps {
    title: string
    children: React.ReactNode
    href: string
}

function TinyWidget({ title, children, href }: TinyWidgetProps) {
    return (
        <Item variant="muted" size="sm" className="gap-2 @xs:gap-8 px-2 lg:px-4 bg-gradient-to-br from-primary/40 to-primary/60 dark:from-primary/60 dark:to-primary/35 border-2 dark:border-t-[color-mix(in_srgb,var(--primary)_30%,white_05%)] border-t-[color-mix(in_srgb,var(--primary)_30%,white_45%)] dark:border-l-[color-mix(in_srgb,var(--primary)_30%,white_05%)] border-l-[color-mix(in_srgb,var(--primary)_30%,white_45%)] border-b-[color-mix(in_srgb,var(--primary)_30%,black_05%)] dark:border-b-[color-mix(in_srgb,var(--primary)_30%,black_45%)] border-r-[color-mix(in_srgb,var(--primary)_20%,black_05%)] dark:border-r-[color-mix(in_srgb,var(--primary)_30%,black_45%)] " asChild>
            <Link href={href} title="Test">
                <ItemHeader>
                    <ItemTitle className="text-background dark:text-muted-foreground text-base">{title}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                    <ItemDescription className="flex items-center gap-2">
                        {children}
                    </ItemDescription>
                </ItemContent>
            </Link>
        </Item>
    )
}

export { TinyWidget }