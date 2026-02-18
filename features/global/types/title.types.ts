import { TypographyProps } from "@/features/global/types/typography"

export type TitleSize = "lg" | "md" | "sm"
export interface TitleProps extends Omit<TypographyProps, "variant"> {
    size?: TitleSize
}
