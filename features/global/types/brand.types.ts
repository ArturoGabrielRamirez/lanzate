export interface BrandProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical"
    align?: "start" | "center" | "end"
    color?: "primary" | "light" | "dark"
    size?: "sm" | "md"
    showText?: boolean
}
