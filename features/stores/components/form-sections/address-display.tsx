"use client"

import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Store, Branch } from "@prisma/client"
import { EditAddressButton } from "../section-buttons"

interface AddressDisplayProps {
    store: Store & { branches: Branch[] }
    userId: number
}

const AddressDisplay = ({ store, userId }: AddressDisplayProps) => {
    const t = useTranslations("store.edit-store")
    const mainBranch = store.branches?.find((branch) => branch.is_main)
    console.log("🚀 ~ AddressDisplay ~ mainBranch:", mainBranch)

    return (
        <AccordionItem value="item-4">
            <AccordionTrigger>
                <span className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {t("address-section")}
                </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground">{t("is-physical-store")}</p>
                        <p className="text-base">{store?.is_physical_store ? "Yes" : "No"}</p>
                    </div>
                    {store?.is_physical_store && (
                        <>
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">{t("address")}</p>
                                <p className="text-base">{mainBranch?.address || "Not provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">{t("city")}</p>
                                <p className="text-base">{mainBranch?.city || "Not provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">{t("province")}</p>
                                <p className="text-base">{mainBranch?.province || "Not provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">{t("country")}</p>
                                <p className="text-base">{mainBranch?.country || "Not provided"}</p>
                            </div>
                        </>
                    )}
                </div>
                <EditAddressButton
                    store={store}
                    userId={userId}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export default AddressDisplay
