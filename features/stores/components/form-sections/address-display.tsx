"use client"

import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { Store, Branch } from "@prisma/client"
import { EditAddressButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AddressDisplayProps {
    store: Store & { branches: Branch[] }
    userId: number
}

const AddressDisplay = ({ store, userId }: AddressDisplayProps) => {
    const t = useTranslations("store.edit-store")
    const mainBranch = store.branches?.find((branch) => branch.is_main)


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {t("address-section")}
                    </span>
                </CardTitle>
                <CardAction>
                    <EditAddressButton
                        store={store}
                        userId={userId}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}

export default AddressDisplay
