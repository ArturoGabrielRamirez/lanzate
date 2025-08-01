import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getProductComments } from "../data/getProductComments"
import CommentsClient from "./comments-client"

type Props = {
    productId: number
}

async function Comments({ productId }: Props) {
    const { payload: user } = await getUserInfo()
    
    // Get initial comments
    const { payload: comments, error } = await getProductComments(productId)
    
    const initialComments = error ? [] : comments || []

    return (
        <CommentsClient 
            productId={productId}
            user={user}
            initialComments={initialComments}
        />
    )
}

export default Comments 