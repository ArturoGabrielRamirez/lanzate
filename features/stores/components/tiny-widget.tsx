import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Link } from "@/i18n/naviation"
import { cn } from "@/lib/utils"

interface TinyWidgetProps {
    title: string
    children: React.ReactNode
    href: string
}

function TinyWidget({ title, children, href }: TinyWidgetProps) {
    return (
        <Item variant="accent" size="sm" className={cn(
            "gap-2 @xs:gap-8 px-2 lg:px-4 shadow-lg hover:text-primary",
            /* "bg-gradient-to-br from-primary/40 to-primary/60",
            "dark:from-primary/60 dark:to-primary/35 border-2",
            "border-t-[color-mix(in_srgb,var(--primary)_30%,white_45%)] border-l-[color-mix(in_srgb,var(--primary)_30%,white_45%)] border-b-[color-mix(in_srgb,var(--primary)_30%,black_05%)]  border-r-[color-mix(in_srgb,var(--primary)_20%,black_05%)] ",
            "dark:border-t-[color-mix(in_srgb,var(--primary)_30%,white_05%)] dark:border-l-[color-mix(in_srgb,var(--primary)_30%,white_05%)] dark:border-b-[color-mix(in_srgb,var(--primary)_30%,black_45%)] dark:border-r-[color-mix(in_srgb,var(--primary)_30%,black_45%)]" */
        )} asChild>
            <Link href={href} title="Test">
                <ItemHeader>
                    <ItemTitle className="text-base">{title}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                    <ItemDescription className="flex items-center gap-2 text-inherit">
                        {children}
                    </ItemDescription>
                </ItemContent>
            </Link>
        </Item>
    )
}

export { TinyWidget }