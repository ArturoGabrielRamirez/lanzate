import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getLikeStatus } from "../actions/getLikeStatus"
import LikeButtonClient from "./like-button-client"

type Props = {
    productId: number
}

async function LikeButton({ productId }: Props) {

    const { payload: user } = await getUserInfo()
    
    // Verificar si el producto ya tiene like del usuario
    let isLiked = false
    if (user) {
        const { payload: likeData, error } = await getLikeStatus(user.id, productId)
        if (!error && likeData) {
            isLiked = likeData.isLiked
        }
    }

    return (
        <LikeButtonClient 
            productId={productId}
            user={user}
            initialLiked={isLiked}
        />
    )
}

export default LikeButton