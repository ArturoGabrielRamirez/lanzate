import { getTranslations } from "next-intl/server";

import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { SectionSubtitle } from "@/features/landing/components";
import { SectionHeaderProps } from "@/features/landing/types";
import { cn } from "@/lib/utils";

export async function SectionHeader({
    icon,
    labelKey,
    titleKey,
    descriptionKey,
    namespace,
    titleClassName,
    descriptionClassName,
    containerClassName
}: SectionHeaderProps) {
    const t = await getTranslations(namespace);

    return (
        <div className={cn(containerClassName)}>
            <LandingSectionIconTitle icon={icon}>
                {t(labelKey)}
            </LandingSectionIconTitle>
            {titleKey && (
                <SectionSubtitle className={titleClassName}>
                    {t(titleKey)}
                </SectionSubtitle>
            )}
            {descriptionKey && (
                <LandingText className={descriptionClassName}>
                    {t(descriptionKey)}
                </LandingText>
            )}
        </div>
    );
}

