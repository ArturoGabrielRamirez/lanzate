import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Link } from "@/i18n/naviation"

interface TinyWidgetProps {
    title: string
    children: React.ReactNode
    href: string
}

function TinyWidget({ title, children, href }: TinyWidgetProps) {
    return (
        <Item variant="muted" size="sm" className="gap-8 px-2 lg:px-4 bg-primary/40" asChild>
            <Link href={href} title="Test">
                <ItemHeader>
                    <ItemTitle className="text-muted-foreground text-base">{title}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                    <ItemDescription className="flex items-end gap-2 text-foreground font-bold">
                        {children}
                    </ItemDescription>
                </ItemContent>
            </Link>
        </Item>
    )
}

export { TinyWidget }