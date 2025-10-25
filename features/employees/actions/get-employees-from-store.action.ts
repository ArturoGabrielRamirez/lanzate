"use server"
import { selectEmployeesFromStore } from "@/features/employees/data/select-employee-from-store.data"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { actionWrapper } from "@/utils/lib"

export async function getEmployeesFromStoreAction(slug: string) {
    return actionWrapper(async () => {
        const { payload: store, hasError: storeError, message: storeMessage } = await getStoresFromSlugAction(slug)
        if (storeError || !store) throw new Error(storeMessage)
        const { payload: employees, error: employeesError, message: employeesMessage } = await selectEmployeesFromStore(Number(store.id))
        if (employeesError || !employees) throw new Error(employeesMessage)
        return {
            message: "Employees fetched successfully",
            payload: employees,
            error: false
        }
    })
} 