"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useTranslations } from "next-intl"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { branchUpdateSchema } from "@/features/branches/schemas"
import { editBranch } from "@/features/branches/actions"
import { EditBranchButtonProps } from "@/features/branches/types"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

function EditBranchButton({ branch, slug, onComplete, userId }: EditBranchButtonProps) {
    
    const [isMain, setIsMain] = useState(branch.is_main)
    const t = useTranslations("store.edit-branch")

    const handleEditBranch = async (payload: any) => {
        const data = {
            ...payload,
            is_main: isMain
        }

        return editBranch(branch.id, data, slug, userId)
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil className="text-muted-foreground size-4" />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={branchUpdateSchema}
            description={t("description")}
            action={handleEditBranch}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="bg-transparent w-full justify-start"
        >
            <InputField 
                name="name" 
                label={t("name")} 
                type="text" 
                defaultValue={branch.name || ""} 
            />
            
            <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea 
                    name="description" 
                    placeholder={t("description-placeholder")}
                    defaultValue={branch.description || ""}
                />
            </div>

            <InputField 
                name="address" 
                label={t("address")} 
                type="text" 
                defaultValue={branch.address || ""} 
            />

            <InputField 
                name="phone" 
                label={t("phone")} 
                type="text" 
                defaultValue={branch.phone || ""} 
            />

            <InputField 
                name="email" 
                label={t("email")} 
                type="email" 
                defaultValue={branch.email || ""} 
            />

            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="is_main" 
                    checked={isMain}
                    onCheckedChange={(checked) => setIsMain(checked as boolean)}
                />
                <Label htmlFor="is_main" className="text-sm">
                    {t("set-as-main")}
                </Label>
            </div>
            {isMain && (
                <p className="text-xs text-muted-foreground">
                    {t("main-branch-note")}
                </p>
            )}
        </ButtonWithPopup>
    )
}
export default EditBranchButton 