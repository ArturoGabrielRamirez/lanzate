"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { StoreIcon, EditIcon, X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

import { Form } from "@/features/global/components/form/form"
import InputField from "@/features/global/components/form/input"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { EditBasicInfoButton } from "@/features/stores/components/section-buttons"
import { editBasicInfoSchema } from "@/features/stores/schemas/basic-info-schema"
import { BasicInfoDisplayProps, BasicInfoFormValues } from "@/features/stores/types"


function BasicInfoDisplay({ store, userId }: BasicInfoDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<BasicInfoFormValues>()

        const initialValues = {
            /* name: store.name,
            description: store.description || "No description",
            subdomain: store.subdomain, */
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
                handleCloseEdit()
                return
            }
            handleOpenEdit()
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={isEditing ? X : EditIcon}
                        onClick={onClick}
                        className="opacity-0 group-hover/basic-info-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información básica
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/basic-info-display">
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editBasicInfoSchema as never)}
                onSuccess={handleCloseEdit}
            >
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <StoreIcon className="size-5" />
                            Basic info
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditBasicInfoButton
                                store={store}
                                userId={userId}
                                onSuccess={handleCloseEdit}
                            />
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-1">
                            <InputField
                                name="name"
                                label={"Name"}
                                defaultValue={store.name}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="description"
                                label={"Description"}
                                defaultValue={store.description || "No description"}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="subdomain"
                                label={"Subdomain"}
                                defaultValue={store.subdomain}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { BasicInfoDisplay }
