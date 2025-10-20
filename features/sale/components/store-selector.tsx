"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/features/shadcn/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Store, Branch } from "@prisma/client"
import { useTranslations } from "next-intl"
import Link from "next/link"

type StoreSelectorProps = {
    stores: (Store & { branches: Branch[] })[]
}

function StoreSelector({ stores }: StoreSelectorProps) {
    const [selectedStore, setSelectedStore] = useState<string>("")
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
    const router = useRouter()
    const t = useTranslations("sale.store-selector")

    // Get the selected store object
    const selectedStoreData = stores.find(store => store.subdomain === selectedStore)

    // Auto-select branch if store has only one branch
    useEffect(() => {
        if (selectedStoreData && selectedStoreData.branches.length === 1) {
            setSelectedBranch(selectedStoreData.branches[0].id)
        } else {
            setSelectedBranch(null)
        }
    }, [selectedStoreData])

    const canProceed = selectedStore && selectedBranch

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="w-full space-y-4">
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                        {stores.map((store) => (
                            <SelectItem key={store.id} value={store.subdomain}>
                                {store.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedStoreData && selectedStoreData.branches.length > 1 && (
                    <Select
                        value={selectedBranch?.toString() || ""}
                        onValueChange={(value) => setSelectedBranch(parseInt(value))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("branch-placeholder") || "Selecciona una sucursal"} />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedStoreData.branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {selectedStoreData && selectedStoreData.branches.length === 1 && (
                    <div className="text-sm text-muted-foreground text-center">
                        Sucursal: {selectedStoreData.branches[0].name}
                    </div>
                )}

                <Button
                    disabled={!canProceed}
                    className="w-full"
                    asChild
                >
                    <Link href={`/sale/${selectedStore}/${selectedBranch}`}>
                        {t("confirm")}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export { StoreSelector }