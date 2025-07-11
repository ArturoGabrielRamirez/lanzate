import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { DeleteStoreButton, EditStoreButton } from "@/features/stores/components"

import { AccountTabProps } from "@/features/stores/types"

async function AccountTab({ slug }: AccountTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                <div className="flex flex-col">
                    <p className="font-light text-sm">Name</p>
                    <p className="font-medium">{store.name}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-sm">Description</p>
                    <p className="font-medium">{store.description || "No description available"}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-light text-sm">Website</p>
                    <a href={`http://${store.subdomain}.localhost.com:3000`} className="font-medium text-blue-500 hover:underline">
                        {`https://${store.subdomain}.lanzate.com`}
                    </a>
                </div>
                <div className="flex flex-col">
                </div>
                <div>
                    <EditStoreButton
                        userId={store.user_id}
                        slug={store.slug}
                        store={store}
                    />
                </div>
            </section>
            <section className="p-4 bg-destructive/10 border-destructive border rounded-md">
                <h2 className="text-lg font-medium mb-4">Danger zone</h2>
                <p className="text-sm text-destructive-foreground">You can delete your store by clicking the button below.</p>
                <p className="text-sm text-destructive-foreground mb-4">Keep in mind that this action is irreversible and it will delete all the data associated with your store.</p>
                <DeleteStoreButton storeId={store.id} />
            </section>
        </>
    )
}
export default AccountTab