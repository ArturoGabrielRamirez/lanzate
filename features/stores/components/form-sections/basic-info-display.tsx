"use client"

import { StoreIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Store } from "@prisma/client"
import { EditBasicInfoButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface BasicInfoDisplayProps {
    store: Store
    userId: number
}

const BasicInfoDisplay = ({ store, userId }: BasicInfoDisplayProps) => {
    const t = useTranslations("store.edit-store")

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2">
                        <StoreIcon className="size-4" />
                        Basic info
                    </span>
                </CardTitle>
                <CardAction>
                    <EditBasicInfoButton
                        store={store}
                        userId={userId}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground">{t("name")}</p>
                        <p className="text-base">{store.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground">{t("description-field")}</p>
                        <p className="text-base">{store.description || "No description"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm text-muted-foreground">{t("subdomain")}</p>
                        <a
                            href={`https://${store.subdomain}.lanzate.app`}
                            className="text-blue-500 hover:underline text-base"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {`https://${store.subdomain}.lanzate.app`}
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInfoDisplay
