import { getStoreSettingsAction } from "@/features/settings/actions/getStoreSettingsAction"
import SettingsForm from "@/features/settings/components/settings-form"
import { SettingsTabProps } from "@/features/settings/types"

async function SettingsTab({ slug, userId }: SettingsTabProps) {
    const { payload: settings, error , message } = await getStoreSettingsAction(slug)

    if (error || !settings) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Unable to load settings. Please try again.</p>
            </div>
        )
    }

    return (
        <div>
            <SettingsForm slug={slug} initialData={settings} />
        </div>
    )
}

export default SettingsTab