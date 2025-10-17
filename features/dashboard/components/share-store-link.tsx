"use client"

import { Copy, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShareStoreLinkProps } from "@/features/dashboard/types"

function ShareStoreLink({ stores }: ShareStoreLinkProps) {
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const t = useTranslations("dashboard.share-store")

    const selectedStore = stores.find(store => store.id.toString() === selectedStoreId)
    const storeUrl = selectedStore ? `https://${selectedStore.subdomain}.lanzate.co` : ""

    const handleCopyUrl = async () => {
        if (!storeUrl) {
            toast.error(t("toast.select-store-first"))
            return
        }

        try {
            await navigator.clipboard.writeText(storeUrl)
            toast.success(t("toast.url-copied"))
        } catch (error) {
            toast.error(t("toast.copy-failed"))
        }
    }

    const handleOpenStore = () => {
        if (!storeUrl) {
            toast.error(t("toast.select-store-first"))
            return
        }
        window.open(storeUrl, '_blank')
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="store-select">{t("select-store")}</Label>
                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                    <SelectTrigger>
                        <SelectValue placeholder={t("choose-store")} />
                    </SelectTrigger>
                    <SelectContent>
                        {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id.toString()}>
                                <div className="flex flex-col">
                                    <span className="font-medium">{store.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {store.subdomain}.lanzate.co
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedStore && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="store-url">{t("store-url")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="store-url"
                                value={storeUrl}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyUrl}
                                title={t("copy-url")}
                            >
                                <Copy className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleOpenStore}
                                title={t("open-store")}
                            >
                                <ExternalLink className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>{t("ready-to-share")}</strong> {t("store-live", { storeName: selectedStore.name })}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            {t("share-instructions")}
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default ShareStoreLink 