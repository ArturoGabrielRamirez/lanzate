import { getTranslations } from "next-intl/server"

import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getEmployeesFromStoreAction } from "@/features/employees/actions/get-employees-from-store.action"
import EmployeesTable from "@/features/employees/components/employees-table"
import { EmployeesTabProps } from "@/features/employees/types"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getStoresFromSlugAction } from "@/features/stores/actions"

async function EmployeesTab({ slug }: EmployeesTabProps) {
    const t = await getTranslations("store.employees-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.log(userMessage)
    }

    // Get user info, employee permissions, employees, and store data
    const [
        { payload: employees, error: employeesError, message: employeesMessage },
        { payload: store, hasError: storeError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getEmployeesFromStoreAction(slug),
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
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

export { EmployeesTab }