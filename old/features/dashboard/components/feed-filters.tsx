"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useQueryState } from "nuqs"

const FeedFilters = () => {

    const [type, setType] = useQueryState("type", { clearOnDefault: true, shallow: false, defaultValue: "all" })

    const handleType = (e: React.MouseEvent<HTMLSpanElement>) => {
        const type = e.currentTarget.dataset.type
        if (type) {
            setType(type)
        }
    }

    return (
        <div className="flex gap-2">
            <Badge
                data-type="likes"
                variant="outline"
                className={cn("cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary transition-all", type === "likes" && "bg-primary/10 text-primary border-primary")}
                onClick={handleType}
            >
                likes
            </Badge>
            <Badge
                data-type="comments"
                variant="outline"
                className={cn("cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary transition-all", type === "comments" && "bg-primary/10 text-primary border-primary")}
                onClick={handleType}
            >
                comments
            </Badge>
            <Badge
                data-type="orders"
                variant="outline"
                className={cn("cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary transition-all", type === "orders" && "bg-primary/10 text-primary border-primary")}
                onClick={handleType}
            >
                orders
            </Badge>
            <Badge
                data-type="all"
                variant="outline"
                className={cn("cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary transition-all", type === "all" && "bg-primary/10 text-primary border-primary")}
                onClick={handleType}
            >
                all
            </Badge>
        </div>
    )
}
export default FeedFilters