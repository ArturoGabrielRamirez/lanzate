import { Rocket, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
    title: string
}

function Header({ title }: Props) {

    return (
        <header className="flex items-center justify-between w-full bg-accent text-accent-foreground p-4">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary" />
                <h1>{title}</h1>
            </Link>
            <div>
                <Button variant="outline" asChild>
                    <Link href="/cart">
                        <ShoppingCart />
                    </Link>
                </Button>
            </div>
        </header>
    )
}

export default Header