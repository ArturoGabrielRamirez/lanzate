"use client"
import { Copy, Loader } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "@/components/ui/select"
import { CopyLinkProps } from "@/features/dashboard/types"

function CopyLink({ stores }: CopyLinkProps) {

    const [selectedStore, setSelectedStore] = useState<number | null>(null)
    const [isCopying, setIsCopying] = useState(false)

    const foundStore = stores.find((store) => store.id === selectedStore)

    const handleStoreChange = (value: string) => {
        setSelectedStore(Number(value))
    }

    const handleCopyLink = async () => {
        setIsCopying(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await navigator.clipboard.writeText(`https://${foundStore?.subdomain}.lanzate.app`)
        toast.success("Link copied to clipboard")
        setIsCopying(false)
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <Select value={selectedStore?.toString() || undefined} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                    {stores.map((store) => (
                        <SelectItem key={store.id} value={String(store.id)}>{store.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {foundStore && (
                <Button className="w-full" onClick={handleCopyLink}>
                    {isCopying ? <Loader className="size-4 animate-spin" /> : <Copy className="size-4" />}
                    {isCopying ? "Copying link..." : "Copy link"}
                </Button>
            )}
        </div>
    )
}

export { CopyLink }