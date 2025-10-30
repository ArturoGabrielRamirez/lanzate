import { CircleHelp } from "lucide-react";

import { BackgroundPattern } from "@/features/landing/components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card";

function FaqSection() {
    return (
        <section className="relative py-17 flex flex-col snap-start">
            <div className="container mx-auto px-4 relative h-full grow w-full">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6 lg:gap-20 z-20 relative">
                    <div>
                        <div className="mb-10 flex items-center gap-2 text-primary">
                            <CircleHelp />
                            <h2 className="text-2xl font-bold font-oswald">FAQ</h2>
                        </div>
                        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground font-quattrocento">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, vero eius, in quasi hic nemo magnam assumenda accusamus dolorem fugiat quia provident inventore enim vitae nobis? Cupiditate quibusdam saepe temporibus?
                        </p>
                    </div>
                    <Card className="mt-20">
                        <CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible defaultValue="item-1">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            <h3 className="text-2xl font-bold font-oswald flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                What is Lanzate?
                                            </h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground font-quattrocento">
                                                Lanzate is a comprehensive all-in-one platform designed to help entrepreneurs and businesses create, manage, and scale their online presence. Our platform combines product management, inventory tracking, social media integration, and sales analytics into a single, powerful solution. Whether you&apos;re just starting out or looking to expand your existing business, Lanzate provides the tools you need to manage multiple stores, track your products, engage with customers through social media, and grow your brand—all from one intuitive dashboard.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>
                                            <h3 className="text-2xl font-bold font-oswald flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                How much does Lanzate cost?
                                            </h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground font-quattrocento">
                                                Lanzate offers flexible pricing options to suit businesses of all sizes. Our Starter plan is completely free and perfect for getting started—it includes up to 2 stores and branches, management for up to 500 products, basic analytics, and social media integration. For growing businesses, our Business plan costs $10 per month and expands your capabilities with up to 5 stores and branches, support for up to 2,000 products, custom branding options, and AI-powered features. Our Enterprise plan, priced at $25 per month, is designed for larger operations and includes unlimited stores and branches, unlimited products, advanced inventory management, comprehensive analytics with custom reports, and dedicated support. You can upgrade or downgrade your plan at any time.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>
                                            <h3 className="text-2xl font-bold font-oswald flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                What features are included in Lanzate?
                                            </h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground font-quattrocento">
                                                Lanzate provides a complete suite of features to manage your online business efficiently. Our platform includes 100% customizable storefronts, allowing you to create a unique brand experience. You can manage multiple stores and branches from a single dashboard, track inventory in real-time, and organize up to hundreds or thousands of products depending on your plan. We seamlessly integrate with popular social media platforms, enabling you to engage with customers through likes, comments, and direct order management. Additionally, Lanzate offers custom domain support so you can build your brand with your own domain name, comprehensive sales analytics to track performance, and AI-powered features to help optimize your business operations. All features are designed to work together seamlessly for a streamlined experience.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>
                                            <h3 className="text-2xl font-bold font-oswald flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                Can I use my own domain name with Lanzate?
                                            </h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground font-quattrocento">
                                                Yes, absolutely! Lanzate supports custom domain names, allowing you to establish a professional online presence with your own branded domain. This feature enables you to build trust with your customers by using a domain that reflects your brand identity rather than a generic subdomain. Setting up your custom domain is straightforward—simply connect your domain through our dashboard, and we&apos;ll guide you through the configuration process. Custom domain support is available on our Business and Enterprise plans, giving you the flexibility to scale your brand as your business grows. This is a key feature for businesses looking to establish a strong, recognizable online presence.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>
                                            <h3 className="text-2xl font-bold font-oswald flex items-center gap-2">
                                                <CircleHelp className="size-6 text-primary" />
                                                How do I get started with Lanzate?
                                            </h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-muted-foreground font-quattrocento">
                                                Getting started with Lanzate is quick and easy. Simply sign up for a free account to access our Starter plan—no credit card required. Once you&apos;ve created your account, you can immediately start setting up your first store, adding products, and configuring your inventory. Our intuitive dashboard will guide you through the initial setup process, and you&apos;ll have access to all the core features right away. If you need assistance, our community support is available to help answer questions and guide you through any challenges. As your business grows, you can seamlessly upgrade to a plan that better suits your needs, unlocking additional features like custom domains, advanced analytics, and AI tools. Start building your online business today with Lanzate&apos;s free plan!
                                            </p>
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