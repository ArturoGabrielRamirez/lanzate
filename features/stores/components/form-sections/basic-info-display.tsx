"use client"

import { StoreIcon, EditIcon, X } from "lucide-react"
import { Store } from "@prisma/client"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { EditBasicInfoButton } from "../section-buttons"
import { editBasicInfoSchema } from "../../schemas/basic-info-schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFormContext } from "react-hook-form"

interface BasicInfoDisplayProps {
    store: Store
    userId: number
}

type BasicInfoFormValues = {
    name: string
    description: string
    subdomain: string
}


const BasicInfoDisplay = ({ store, userId }: BasicInfoDisplayProps) => {
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
            name: store.name,
            description: store.description || "No description",
            subdomain: store.subdomain,
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
            <IconButton
                icon={isEditing ? X : EditIcon}
                onClick={onClick}
            />
        )
    }

    return (
        <Card>
            <Form
                submitButton={false}
                contentButton={false}
                resolver={yupResolver(editBasicInfoSchema)}
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

export default BasicInfoDisplay
