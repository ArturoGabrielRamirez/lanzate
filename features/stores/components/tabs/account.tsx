import { getTranslations } from "next-intl/server"

import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/features/shadcn/components/ui/tabs"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { DeleteStoreButton } from "@/features/stores/components/delete-store-button"
/* import { StoreInformationForm } from "@/features/stores/components/store-information-form" */
import { AccountTabProps } from "@/features/stores/types"

async function AccountTab({ slug }: AccountTabProps) {

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    const t = await getTranslations("store.account-tab")
    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const [
        { payload: store, hasError: storeError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
    ])

    if (storeError || !store) {
        console.error(storeError)
        return null
    }

    if (permissionsError || !employeePermissions) {
        console.error("Error loading employee permissions")
        return null
    }

    const canManageStore = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_store

    return (
        <div className="flex flex-col gap-6">
            <Tabs defaultValue="tab-1">
                <TabsList variant="underline">
                    <TabsTab value="tab-1">Tab 1</TabsTab>
                    <TabsTab value="tab-2">Tab 2</TabsTab>
                    <TabsTab value="danger-zone">{t("danger-zone")}</TabsTab>
                </TabsList>
                <TabsPanel value="tab-1">Tab 1 content</TabsPanel>
                <TabsPanel value="tab-2">Tab 2 content</TabsPanel>
                <TabsPanel value="danger-zone">
                    {canManageStore && (
                        <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive">{t("danger-zone")}</CardTitle>
                                <CardDescription>
                                    {t("delete-warning")} {t("delete-irreversible")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DeleteStoreButton storeId={store.id} userId={user.id} />
                            </CardContent>
                        </Card>
                    )}
                </TabsPanel>
            </Tabs>
            {/* <StoreInformationForm
                store={store as never}
                canManageStore={canManageStore}
                userId={user.id}
            /> */}

            {/* Danger Zone Card */}

        </div>
    )
}

export default AccountTab