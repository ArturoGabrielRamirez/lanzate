import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getProductLikeInfo } from "../data/getProductLikeInfo"
import LikeButtonClient from "./like-button-client"

type Props = {
    productId: number
}

async function LikeButton({ productId }: Props) {

    const { payload: user } = await getUserInfo()
    
    // Obtener el estado del like y el conteo total
    const { payload: likeInfo, error } = await getProductLikeInfo(user?.id || null, productId)
    
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

export default LikeButton