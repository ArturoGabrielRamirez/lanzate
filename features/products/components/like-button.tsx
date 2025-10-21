import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { LikeButtonClient } from "@/features/products/components/like-button-client"
import { getProductLikeInfo } from "@/features/products/data/get-product-like-info.data"

type Props = {
    productId: number
}

async function LikeButton({ productId }: Props) {

    const { payload: user } = await getUserInfo()

    // Obtener el estado del like y el conteo total
    const { payload: likeInfo } = await getProductLikeInfo(user?.id || null, productId)

    const isLiked = likeInfo?.isLiked || false
    const count = likeInfo?.count || 0

    return (
        <LikeButtonClient
            productId={productId}
            user={user}
            initialLiked={isLiked}
            initialCount={count}
        />
    )
}

export { LikeButton }