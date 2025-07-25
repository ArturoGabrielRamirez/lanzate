"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { DashboardStore } from "../types/types"

type ShareStoreLinkProps = {
    stores: DashboardStore[]
}

function ShareStoreLink({ stores }: ShareStoreLinkProps) {
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")

    const selectedStore = stores.find(store => store.id.toString() === selectedStoreId)
    const storeUrl = selectedStore ? `https://${selectedStore.subdomain}.lanzate.co` : ""

    const handleCopyUrl = async () => {
        if (!storeUrl) {
            toast.error("Please select a store first")
            return
        }

        try {
            await navigator.clipboard.writeText(storeUrl)
            toast.success("Store URL copied to clipboard!")
        } catch (error) {
            toast.error("Failed to copy URL to clipboard")
        }
    }

    const handleOpenStore = () => {
        if (!storeUrl) {
            toast.error("Please select a store first")
            return
        }
        window.open(storeUrl, '_blank')
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="store-select">Select Store to Share</Label>
                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a store..." />
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
                        <Label htmlFor="store-url">Store URL</Label>
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
                                title="Copy URL"
                            >
                                <Copy className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleOpenStore}
                                title="Open Store"
                            >
                                <ExternalLink className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Ready to share!</strong> Your store "<strong>{selectedStore.name}</strong>" is live and ready for customers.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Share this link on social media, send it to customers, or add it to your business cards.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default ShareStoreLink 