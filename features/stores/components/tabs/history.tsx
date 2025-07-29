import { getStoreLogs } from "../../actions/getStoreLogs"
import { HistoryTabProps } from "@/features/stores/types"
import HistoryTable from "../history-table"
import { getTranslations } from "next-intl/server"

async function HistoryTab({ slug, userId }: HistoryTabProps) {

    const { payload: logs, error } = await getStoreLogs(slug)
    const t = await getTranslations("store.history-tab")

    if (error || !logs) {
        return <div>{t("error-loading-logs")}</div>
    }

    return (
        <HistoryTable data={logs} slug={slug} />
    )
}

export default HistoryTab 