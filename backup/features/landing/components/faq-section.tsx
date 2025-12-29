import { CircleHelp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingSectionWrapper, SectionHeader, SectionSubtitleSmall, SmallMutedText } from "@/features/landing/components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card";

async function FaqSection() {
    const t = await getTranslations("landing.faq");

    const faqItems = Array.from({ length: 5 }, (_, i) => ({
        id: `item-${i + 1}`,
        questionKey: `items.item${i + 1}.question`,
        answerKey: `items.item${i + 1}.answer`
    }));

    return (
        <LandingSectionWrapper
            id="faq"
            className="flex-col"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6 lg:gap-20 text-center text-balance md:text-left">
                <SectionHeader
                    icon={<CircleHelp />}
                    labelKey="header.label"
                    titleKey="header.title"
                    descriptionKey="header.description"
                    namespace="landing.faq"
                />
                    <Card>
                        <CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible defaultValue="item-1">
                                    {faqItems.map((item) => (
                                        <AccordionItem key={item.id} value={item.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center gap-2">
                                                    <CircleHelp className="size-5 text-primary" />
                                                    <SectionSubtitleSmall as="span">
                                                        {t(item.questionKey)}
                                                    </SectionSubtitleSmall>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <SmallMutedText>{t(item.answerKey)}</SmallMutedText>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </CardHeader>
                    </Card>
            </div>
        </LandingSectionWrapper>
    )
}

export { FaqSection };