import { CircleHelp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingSectionWrapper, SectionHeader, SectionSubtitleSmall, SmallMutedText } from "@/features/landing/components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card";

async function FaqSection() {
    const t = await getTranslations("landing.faq");

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
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <CircleHelp className="size-5 text-primary" />
                                                <SectionSubtitleSmall as="span">
                                                    {t('items.item1.question')}
                                                </SectionSubtitleSmall>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <SmallMutedText>{t('items.item1.answer')}</SmallMutedText>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <CircleHelp className="size-5 text-primary" />
                                                <SectionSubtitleSmall as="span">
                                                    {t('items.item2.question')}
                                                </SectionSubtitleSmall>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <SmallMutedText>{t('items.item2.answer')}</SmallMutedText>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                <SectionSubtitleSmall as="span">
                                                    {t('items.item3.question')}
                                                </SectionSubtitleSmall>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <SmallMutedText>{t('items.item3.answer')}</SmallMutedText>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                <SectionSubtitleSmall as="span">
                                                    {t('items.item4.question')}
                                                </SectionSubtitleSmall>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <SmallMutedText>{t('items.item4.answer')}</SmallMutedText>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                <SectionSubtitleSmall as="span">
                                                    {t('items.item5.question')}
                                                </SectionSubtitleSmall>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <SmallMutedText>{t('items.item5.answer')}</SmallMutedText>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </CardHeader>
                    </Card>
            </div>
        </LandingSectionWrapper>
    )
}

export { FaqSection };