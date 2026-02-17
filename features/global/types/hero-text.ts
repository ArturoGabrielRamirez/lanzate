import { TypographyProps } from "./typography";

export type HeroTextSize = "lg" | "base"
export interface HeroTextProps extends Omit<TypographyProps, "variant"> {
    size?: HeroTextSize
}