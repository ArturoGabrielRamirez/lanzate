import { getStoreOpeningHoursAction } from "@/features/stores/actions/get-store-opening-hours.action"
import { OpeningHoursFormWrapper } from "@/features/stores/components/wrappers/opening-hours-wrapper.client"
import { SettingsFormType } from "@/features/stores/schemas"

const INT_TO_DAY: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday"
}

export async function OpeningHoursServerWrapper({ slug }: { slug: string }) {
    const { payload } = await getStoreOpeningHoursAction(slug)

    if (!payload) {
        return null
    }

    const { operational_settings, opening_hours } = payload

    // Group opening hours by start and end time to reconstruct the UI format
    const groupedHours: Record<string, { days: string[], startTime: string, endTime: string }> = {}

    opening_hours.forEach((hour) => {
        const key = `${hour.start}-${hour.end}`
        const dayStr = INT_TO_DAY[hour.day]
        
        if (dayStr) {
            if (!groupedHours[key]) {
                groupedHours[key] = {
                    days: [],
                    startTime: hour.start,
                    endTime: hour.end
                }
            }
            groupedHours[key].days.push(dayStr)
        }
    })

    const attentionDates = Object.values(groupedHours)

    const settingsData: SettingsFormType["settings"] = {
        is_open_24_hours: operational_settings?.is_open_24_hours ?? true,
        attention_dates: attentionDates
    }

    return <OpeningHoursFormWrapper data={settingsData} slug={slug} />
}

