"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Label } from "@/features/shadcn/components/ui/label"
import { Branch } from "@prisma/client"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslations } from "next-intl"

interface BranchSelectorProps {
    branches: Branch[]
    value: number | null
    onChange: (branchId: number) => void
}

export function BranchSelector({ branches, value, onChange }: BranchSelectorProps) {
    const { setValue } = useFormContext()
    const t = useTranslations("checkout.delivery.branch-selector")

    useEffect(() => {
        setValue("branchId", value)
    }, [value, setValue])

    useEffect(() => {
        if (branches.length === 1 && !value) {
            const singleBranch = branches[0]
            onChange(singleBranch.id)
            setValue("branchId", singleBranch.id)
        }
    }, [branches, value, onChange, setValue])

    const handleBranchChange = (branchIdString: string) => {
        const branchId = Number(branchIdString)
        onChange(branchId)
        setValue("branchId", branchId)
    }

    return (
        <div>
            <Label htmlFor="branchId" className="text-base font-medium mb-2 block">
                {t("label")}
            </Label>
            <Select
                value={value?.toString() || ""}
                onValueChange={handleBranchChange}
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("placeholder")} />
                </SelectTrigger>
                <SelectContent>
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
} 