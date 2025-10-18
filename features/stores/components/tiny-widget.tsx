import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Link } from "@/i18n/naviation"

interface TinyWidgetProps {
    title: string
    children: React.ReactNode
    href: string
}

function TinyWidget({ title, children, href }: TinyWidgetProps) {
    return (
        <Item variant="muted" size="sm" className="gap-2 @xs:gap-8 px-2 lg:px-4 bg-primary/40" asChild>
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