"use server"
import { selectEmployeesFromStoreData } from "@/features/employees/data/select-employee-from-store.data"
import { actionWrapper } from "@/features/global/utils"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"

export async function getEmployeesFromStoreAction(slug: string) {
    return actionWrapper(async () => {
        const { payload: store, hasError: storeError, message: storeMessage } = await getStoresFromSlugAction(slug)
        if (storeError || !store) throw new Error(storeMessage)
        const { payload: employees, hasError: employeesError, message: employeesMessage } = await selectEmployeesFromStoreData(Number(store.id))
        if (employeesError || !employees) throw new Error(employeesMessage)
        return {
            message: "Employees fetched successfully",
            payload: employees,
            hasError: false
        }
    })
} 