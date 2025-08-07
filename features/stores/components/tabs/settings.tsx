import SettingsForm from "@/features/settings/components/settings-form"
import { SettingsTabProps } from "@/features/settings/types"

async function SettingsTab({ slug }: SettingsTabProps) {

    return (
        <div>
            <SettingsForm slug={slug} />
        </div>
    )
}

export default SettingsTab