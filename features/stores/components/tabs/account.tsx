import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { StoreInformationForm } from "@/features/stores/components/store-information-form"
import { AccountTabProps } from "@/features/stores/types"

async function AccountTab({ slug }: AccountTabProps) {

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    /* const [
        { payload: store, hasError: storeError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
    ])

    if (storeError || !store) {
        console.error(storeError)
        return null
    } */

    /* if (permissionsError || !employeePermissions) {
        console.error("Error loading employee permissions")
        return null
    } */

    //const canManageStore = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_store

    return (
        <div className="flex flex-col gap-6">
            
            <StoreInformationForm
                //store={store as never}
                canManageStore={false}
                userId={user.id}
            />
        </div>
    )
}

export default AccountTab