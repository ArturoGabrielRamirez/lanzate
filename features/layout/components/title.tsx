import { Home, House } from "lucide-react"
import Link from "next/link"

type TitleProps = {
    className?: string
    title: string
    breadcrumbs?: {
        label: string
        href: string
    }[]
}

const Title = ({ title, breadcrumbs, className }: TitleProps) => {
    return (
        <div className={`flex flex-col gap-0 mb-12 ${className}`}>
            <h2 className='text-3xl dark:text-white font-bold'>{title}</h2>
            {breadcrumbs && breadcrumbs?.length > 0 && (
                <div className="flex items-end gap-2 text-muted-foreground/50">
                    <Link href="/" className="capitalize hover:text-primary">
                        Home
                    </Link>
                    <span className="text-xl">/</span>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <>
                            <Link key={index} href={breadcrumb.href} className="capitalize hover:text-primary">
                                {breadcrumb.label}
                            </Link>
                            {index !== breadcrumbs.length - 1 && (
                                <span className="text-xl">/</span>
                            )}
                        </>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Title