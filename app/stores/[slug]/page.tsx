import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Title from "@/features/layout/components/title"
import Link from "next/link"

type Props = {
    params: Promise<{ slug: string }>
}

async function StoreDetailsPage({ params }: Props) {

    const { slug } = await params


    return (
        <div className="p-4 grow flex flex-col">
            <Title title="Store Details" />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex items-center gap-4 w-full">
                        <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=feliz`}
                            alt="User avatar"
                            className="size-24 rounded-full"
                        />
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-bold">Store Name</p>
                            <div>
                                <p className="capitalize">
                                    lorem ipsum dolor sit amet
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </section>
        </div>
    )
}
export default StoreDetailsPage