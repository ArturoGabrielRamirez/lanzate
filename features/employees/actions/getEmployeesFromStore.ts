"use server"
import { actionWrapper } from "@/utils/lib"
import { selectEmployeesFromStore } from "../data/selectEmployeesFromStore"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"

export async function getEmployeesFromStore(slug: string) {
    return actionWrapper(async () => {
        const { payload: store, error: storeError, message: storeMessage } = await getStoresFromSlug(slug)
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