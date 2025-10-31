import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { CommentsClient } from "@/features/products/components/comments-client"
import { getProductCommentsData } from "@/features/products/data/get-product-comments.data"
import type { CommentsProps } from "@/features/products/types"

async function Comments({ productId }: CommentsProps) {
    const { payload: user } = await getUserInfo()

    // Get initial comments
    const { payload: comments, hasError } = await getProductCommentsData(productId)

    const initialComments = hasError ? [] : comments || []

    return (
        <CommentsClient
            productId={productId}
            user={user}
            initialComments={initialComments}
        />
    )
}

export { Comments } 