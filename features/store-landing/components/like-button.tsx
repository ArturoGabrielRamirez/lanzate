import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"

type Props = {
    productId: number
}

function LikeButton({ productId }: Props) {

    return (
        <Button variant="outline" size="icon">
            <Flame />
        </Button>
    )
}
export default LikeButton