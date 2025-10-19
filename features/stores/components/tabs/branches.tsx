import { BranchTable } from "@/features/branches/components/branch-table"
import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { BranchesTabProps } from "@/features/stores/types"

async function BranchesTab({ slug }: BranchesTabProps) {

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.log(userMessage)
    }

    // Get user info and employee permissions
    const [
        { payload: store, hasError: storeError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError)
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    return (
        <>
            <BranchTable
                branches={store.branches}
                storeId={store.id}
                userId={user.id}
                slug={slug}
                employeePermissions={employeePermissions}
            />
        </>
    )
}

export default BranchesTab