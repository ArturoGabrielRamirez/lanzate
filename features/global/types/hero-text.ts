import { TypographyProps } from "@/features/global/types/typography";

export type HeroTextSize = "lg" | "base"
export interface HeroTextProps extends Omit<TypographyProps, "variant"> {
    size?: HeroTextSize
}