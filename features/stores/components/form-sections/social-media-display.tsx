"use client"

import { MessageCircle, Edit as EditIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Branch, Store, StoreOperationalSettings } from "@prisma/client"
import { EditSocialMediaButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, InputField } from "@/features/layout/components"
import { useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { yupResolver } from "@hookform/resolvers/yup"
import { editSocialMediaSchema, type EditSocialMediaData } from "../../schemas/social-media-schema"
import { useFormContext } from "react-hook-form"

interface SocialMediaDisplayProps {
    store: Store & { operational_settings: StoreOperationalSettings | null, branches: Branch[] }
}

const SocialMediaDisplay = ({ store }: SocialMediaDisplayProps) => {
    const t = useTranslations("store.edit-store")
    const [isEditing, setIsEditing] = useState(false)
    const mainBranch = store.branches?.find((branch) => branch.is_main)
    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<EditSocialMediaData>()

        const initialValues: EditSocialMediaData = {
            facebook_url: mainBranch?.facebook_url || "",
            instagram_url: mainBranch?.instagram_url || "",
            x_url: mainBranch?.x_url || "",
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
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editSocialMediaSchema)}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <MessageCircle className="size-5" />
                            {t("social-media-section")}
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditSocialMediaButton
                                store={store}
                                onSuccess={handleCloseEdit}
                            />
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <InputField
                                name="facebook_url"
                                label={t("facebook-url")}
                                defaultValue={mainBranch?.facebook_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="instagram_url"
                                label={t("instagram-url")}
                                defaultValue={mainBranch?.instagram_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-1">
                            <InputField
                                name="x_url"
                                label={t("x-url")}
                                defaultValue={mainBranch?.x_url || ""}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default SocialMediaDisplay
