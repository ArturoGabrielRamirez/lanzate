import { getEmployeesFromStore } from "@/features/employees/actions/getEmployeesFromStore"
import { getStoresFromSlug } from "@/features/stores/actions/get-stores-from-slug.action"
import { getEmployeePermissions } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import EmployeesTable from "@/features/employees/components/employees-table"
import { EmployeesTabProps } from "@/features/employees/types/index"
import { getTranslations } from "next-intl/server"

async function EmployeesTab({ slug, userId }: EmployeesTabProps) {
    const t = await getTranslations("store.employees-tab")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.log(userMessage)
    }
    
    // Get user info, employee permissions, employees, and store data
    const [
        { payload: employees, error: employeesError, message: employeesMessage },
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getEmployeesFromStore(slug),
        getStoresFromSlug(slug),
        getEmployeePermissions(user.id, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (employeesError || !employees) {
        return <div>{employeesMessage || t("error-loading-employees")}</div>
    }

    if (storeError || !store) {
        return <div>{t("error-loading-store")}</div>
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    return (
        <EmployeesTable 
            data={employees} 
            userId={user.id} 
            slug={slug} 
            storeId={store.id}
            employeePermissions={employeePermissions}
        />
    )
}

export default EmployeesTab