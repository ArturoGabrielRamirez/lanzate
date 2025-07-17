"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { parseAsInteger, useQueryState } from "nuqs"
type Props = {
    productAmount: number
    limit: number
}

function PaginationNav({ productAmount, limit }: Props) {

    const [page, setPage] = useQueryState("page", { shallow: false, ...parseAsInteger.withDefault(1), clearOnDefault: false })

    const handleNextPage = () => {
        if (page < Math.ceil(productAmount / limit)) {
            setPage(page + 1)
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    const handlePageChange = (page: number) => {
        setPage(page)
    }


    return (
        <div className="flex justify-center gap-1  bottom-4 left-0 right-0">
            <Button variant="outline" size="icon" onClick={handlePreviousPage}>
                <ChevronLeft />
            </Button>
            <div className="flex gap-2">
                {Array.from({ length: Math.ceil(productAmount / limit) }).map((_, index) => (
                    <Button key={index} variant="outline" size="icon" className={cn(page === index + 1 && "bg-primary text-primary-foreground", page === index + 1 && "!bg-primary !text-primary-foreground")} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Button>
                ))}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextPage}>
                <ChevronRight />
            </Button>
        </div>
    )
}
export default PaginationNav