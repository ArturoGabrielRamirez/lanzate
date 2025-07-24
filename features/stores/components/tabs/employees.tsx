import { getEmployeesFromStore } from "@/features/employees/actions/getEmployeesFromStore"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import EmployeesTable from "@/features/employees/components/employees-table"
import { EmployeesTabProps } from "@/features/employees/types/index"

async function EmployeesTab({ slug, userId }: EmployeesTabProps) {
    const { payload: employees, error, message } = await getEmployeesFromStore(slug)
    const { payload: store, error: storeError } = await getStoresFromSlug(slug)

    if (error || !employees) {
        return <div>{message || "Error al cargar empleados"}</div>
    }

    if (storeError || !store) {
        return <div>Error al cargar la tienda</div>
    }

    return (
        <EmployeesTable data={employees} userId={userId} slug={slug} storeId={store.id} />
    )
}
export default EmployeesTab