import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { CommentsClient } from "@/features/products/components/comments-client"
import { getProductCommentsData } from "@/features/products/data/get-product-comments.data"

type Props = {
    productId: number
}

async function Comments({ productId }: Props) {
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