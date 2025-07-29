import { getEmployeesFromStore } from "@/features/employees/actions/getEmployeesFromStore"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import EmployeesTable from "@/features/employees/components/employees-table"
import { EmployeesTabProps } from "@/features/employees/types/index"
import { getTranslations } from "next-intl/server"

async function EmployeesTab({ slug, userId }: EmployeesTabProps) {
    const { payload: employees, error, message } = await getEmployeesFromStore(slug)
    const { payload: store, error: storeError } = await getStoresFromSlug(slug)
    const t = await getTranslations("store.employees-tab")

    if (error || !employees) {
        return <div>{message || t("error-loading-employees")}</div>
    }

    if (storeError || !store) {
        return <div>{t("error-loading-store")}</div>
    }

    return (
        <EmployeesTable data={employees} userId={userId} slug={slug} storeId={store.id} />
    )
}
export default EmployeesTab