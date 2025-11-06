import { CircleHelp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { BackgroundPattern, SectionSubtitle, SectionSubtitleSmall, SmallMutedText } from "@/features/landing/components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card";

async function FaqSection() {
    const t = await getTranslations("landing.faq");

    return (
        <section className="relative pt-17 md:py-17 flex flex-col snap-start" id="faq">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6 lg:gap-20 z-20 relative text-center text-balance md:text-left">
                    <div>
                        <LandingSectionIconTitle icon={<CircleHelp />}>
                            {t('header.label')}
                        </LandingSectionIconTitle>
                        <SectionSubtitle>
                            {t('header.title')}
                        </SectionSubtitle>
                        <LandingText>
                            {t('header.description')}
                        </LandingText>
                    </div>
                    <Card className="md:mt-20">
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
            </div>
        </section>
    )
}

export { FaqSection };