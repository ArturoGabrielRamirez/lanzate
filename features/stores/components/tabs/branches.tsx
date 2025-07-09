import { House } from "lucide-react"
import { getStoresFromSlug } from "../../actions/getStoresFromSlug"

type Props = {
    slug: string
}

async function BranchesTab({ slug }: Props) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }
    return (
        <div>
            {store.branches.map((branch) => (
                <article key={branch.id} className="border border-border p-4 rounded-md">
                    <p className="flex items-center gap-2">
                        <House />
                        {branch.name}
                    </p>
                </article>
            ))}
        </div>
    )
}
export default BranchesTab