import { getStoreLogs } from "../../actions/getStoreLogs"
import { HistoryTabProps } from "@/features/stores/types"
import HistoryTable from "../history-table"

async function HistoryTab({ slug, userId }: HistoryTabProps) {

    const { payload: logs, error } = await getStoreLogs(slug)

    if (error || !logs) {
        return <div>Error loading logs</div>
    }

    return (
        <HistoryTable data={logs} slug={slug} />
    )
}

export default HistoryTab 