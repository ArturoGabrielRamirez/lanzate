"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "@/components/ui/select"
import { Store } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"

type Props = {
    stores: Store[]
}
const SettingsLinks = ({ stores }: Props) => {

    const [selectedStore, setSelectedStore] = useState<number | null>(null)

    const foundStore = stores.find((store) => store.id === selectedStore)

    const handleStoreChange = (value: string) => {
        setSelectedStore(Number(value))
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
                <Button asChild className="w-full">
                    <Link href={`/stores/${foundStore?.slug}/account`}>
                        Go to settings
                    </Link>
                </Button>
            )}
        </div>
    )
}
export default SettingsLinks