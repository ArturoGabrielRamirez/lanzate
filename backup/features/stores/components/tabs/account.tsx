import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { StoreInformationForm } from "@/features/stores/components/store-information-form"
import { AccountTabProps } from "@/features/stores/types"

async function AccountTab({ slug }: AccountTabProps) {

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    return (
        <div className="flex flex-col gap-6">
            
            <StoreInformationForm
                userId={user.id}
                slug={slug}
            />
        </div>
    )
}

export default AccountTab
