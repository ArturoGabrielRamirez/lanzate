export type TypographyVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "code"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "2xs"

export type TypographyWeight = "light" | "normal" | "medium" | "semibold" | "bold"
export type TypographyAlign = "left" | "center" | "right" | "justify"

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant
    weight?: TypographyWeight
    align?: TypographyAlign
    asChild?: boolean
    as?: React.ElementType
}