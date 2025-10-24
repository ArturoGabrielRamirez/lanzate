import { Store } from "lucide-react"

import Button from "@/features/layout/components/universal-button"

function Swatches() {
    return (
        <section className="pt-17 px-4">
            <div className="flex gap-2">
                <Button />
                <Button>Custom text</Button>
                <Button iconAfter={<Store className="size-4 md:size-5"/>}>
                    Icon after
                </Button>
                <Button iconBefore={<Store className="size-4 md:size-5"/>}>
                    Icon before
                </Button>
                <Button variant="rounded" size="rounded">
                    <Store/>
                </Button>
                <Button size="rounded">
                    <Store/>
                </Button>
            </div>
        </section>
    )
}
export default Swatches