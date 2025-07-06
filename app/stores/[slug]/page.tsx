import Title from "@/features/layout/components/title"

type Props = {
    params: Promise<{ slug: string }>
}

async function StoreDetailsPage({ params }: Props) {

    const { slug } = await params

    
    return (
        <div className="p-4">
            <Title title="Store Details" />
        </div>
    )
}
export default StoreDetailsPage