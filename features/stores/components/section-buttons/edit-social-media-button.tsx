"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import { useTranslations } from "next-intl"
import { ButtonWithPopup } from "@/features/layout/components"
import { InputField } from "@/features/layout/components"
import { editSocialMediaSchema } from "../../schemas/social-media-schema"
import { updateStoreSocialMedia } from "../../actions/updateStoreSocialMedia"
import { Store, StoreOperationalSettings } from "@prisma/client"

interface EditSocialMediaButtonProps {
    store: Store & { operational_settings: StoreOperationalSettings | null }
    className?: string
}

const EditSocialMediaButton = ({ store, className }: EditSocialMediaButtonProps) => {
    const t = useTranslations("store.edit-store")

    const handleEditSocialMedia = async (payload: { facebook_url?: string; instagram_url?: string; x_url?: string }) => {
        return updateStoreSocialMedia(store.id, payload)
    }

    const messages = {
        success: t("social-media-updated-success"),
        error: t("social-media-updated-error"),
        loading: t("social-media-updating")
    }

    return (
        <ButtonWithPopup
            text={
                <>
                    <Facebook className="size-4" />
                    {t("edit-social-media")}
                </>
            }
            title={t("edit-social-media-title")}
            description={t("edit-social-media-description")}
            schema={editSocialMediaSchema}
            action={handleEditSocialMedia}
            messages={messages}
            className={className}
        >
            <div className="space-y-4">
                <InputField
                    name="facebook_url"
                    label="Facebook"
                    placeholder={t("facebook-url-placeholder")}
                    defaultValue={store.facebook_url || ""}
                    type="url"
                />
                <InputField
                    name="instagram_url"
                    label="Instagram"
                    placeholder={t("instagram-url-placeholder")}
                    defaultValue={store.instagram_url || ""}
                    type="url"
                />
                <InputField
                    name="x_url"
                    label="X (Twitter)"
                    placeholder={t("x-url-placeholder")}
                    defaultValue={store.x_url || ""}
                    type="url"
                />
            </div>
        </ButtonWithPopup>
    )
}

export default EditSocialMediaButton
