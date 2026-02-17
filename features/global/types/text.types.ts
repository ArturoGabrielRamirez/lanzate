import { TypographyProps } from "./typography"

export type TextSize = "lg" | "base" | "sm" | "xs"
export interface TextProps extends Omit<TypographyProps, "variant"> {
    size?: TextSize
}