"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { branchUpdateSchema } from "../schemas/branch-schema"
import { editBranch } from "../actions/editBranch"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil } from "lucide-react"
import { EditBranchButtonProps } from "../types"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

function EditBranchButton({ branch, slug, onComplete, userId }: EditBranchButtonProps) {
    
    const [isMain, setIsMain] = useState(branch.is_main)

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
                    Edit Branch
                </>
            )}
            title="Edit branch"
            schema={branchUpdateSchema}
            description="Edit the branch details including name, address, phone, and email. You can also designate this branch as the main branch."
            action={handleEditBranch}
            onComplete={onComplete}
            messages={{
                success: "Branch updated successfully!",
                error: "Failed to update branch",
                loading: "Updating branch..."
            }}
            className="bg-transparent w-full justify-start"
        >
            <InputField 
                name="name" 
                label="Name" 
                type="text" 
                defaultValue={branch.name || ""} 
            />
            
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    name="description" 
                    placeholder="Branch description"
                    defaultValue={branch.description || ""}
                />
            </div>

            <InputField 
                name="address" 
                label="Address" 
                type="text" 
                defaultValue={branch.address || ""} 
            />

            <InputField 
                name="phone" 
                label="Phone" 
                type="text" 
                defaultValue={branch.phone || ""} 
            />

            <InputField 
                name="email" 
                label="Email" 
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
                    Set as main branch
                </Label>
            </div>
            {isMain && (
                <p className="text-xs text-muted-foreground">
                    This will be the primary branch for the store. All other branches will be unset as main.
                </p>
            )}
        </ButtonWithPopup>
    )
}

export default EditBranchButton 