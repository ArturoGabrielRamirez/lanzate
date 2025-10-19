import { getTranslations } from "next-intl/server"

import { HistoryTable } from "@/features/history/components/history-table"
import { getStoreLogsAction } from "@/features/stores/actions/get-store-logs.action"
import { HistoryTabProps } from "@/features/stores/types"

async function HistoryTab({ slug }: HistoryTabProps) {

    const { payload: logs, hasError } = await getStoreLogsAction(slug)
    const t = await getTranslations("store.history-tab")

    if (hasError || !logs) {
        return <div>{t("error-loading-logs")}</div>
    }

    return (
        <HistoryTable data={logs} slug={slug} />
    )
}

export default HistoryTab 