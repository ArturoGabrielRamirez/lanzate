import { TypographyProps } from "./typography"

export type TitleSize = "lg" | "md" | "sm"
export interface TitleProps extends Omit<TypographyProps, "variant"> {
    size?: TitleSize
}
