import SettingsForm from "@/features/settings/components/settings-form"
import { SettingsTabProps } from "@/features/settings/types"

async function SettingsTab({ slug }: SettingsTabProps) {

    return (
        <SettingsForm slug={slug} />
    )
}

export default SettingsTab