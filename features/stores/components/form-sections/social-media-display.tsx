"use client"

import { MessageCircle, Facebook, Instagram, Twitter } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Store, StoreOperationalSettings } from "@prisma/client"
import { EditSocialMediaButton } from "../section-buttons"

interface SocialMediaDisplayProps {
    store: Store & { operational_settings: StoreOperationalSettings | null }
}

const SocialMediaDisplay = ({ store }: SocialMediaDisplayProps) => {
    const t = useTranslations("store.edit-store")

    return (
        <AccordionItem value="item-3">
            <AccordionTrigger>
                <span className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    {t("social-media-section")}
                </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Facebook className="size-4" />
                            {t("facebook-url")}
                        </p>
                        {store.facebook_url ? (
                            <a
                                href={store.facebook_url}
                                className="text-blue-500 hover:underline text-base"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {store.facebook_url}
                            </a>
                        ) : (
                            <p className="text-base">Not provided</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Instagram className="size-4" />
                            {t("instagram-url")}
                        </p>
                        {store.instagram_url ? (
                            <a
                                href={store.instagram_url}
                                className="text-blue-500 hover:underline text-base"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {store.instagram_url}
                            </a>
                        ) : (
                            <p className="text-base">Not provided</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Twitter className="size-4" />
                            {t("x-url")}
                        </p>
                        {store.x_url ? (
                            <a
                                href={store.x_url}
                                className="text-blue-500 hover:underline text-base"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {store.x_url}
                            </a>
                        ) : (
                            <p className="text-base">Not provided</p>
                        )}
                    </div>
                    
                </div>
                <EditSocialMediaButton
                    store={store}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export default SocialMediaDisplay
