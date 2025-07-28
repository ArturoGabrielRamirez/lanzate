import { useTranslations } from "next-intl"
import Link from "next/link"
import React from "react"

type TitleProps = {
    className?: string
    title: string | React.ReactNode
    breadcrumbs?: {
        label: string
        href: string
    }[]
    canGoBack?: boolean
    showDate?: boolean
}

const Title = ({ title, breadcrumbs, className, showDate }: TitleProps) => {

    const t = useTranslations("layout");
    return (
        <div className={`flex flex-col gap-0 mb-6 ${className}`}>
            <div className="flex items-center gap-2 justify-between">
                <h2 className='text-3xl dark:text-white font-bold flex items-center gap-2'>
                    {/* {canGoBack && (
                    <Link href="/" className="capitalize hover:text-primary">
                        <ArrowLeft />
                    </Link>
                )} */}
                    {title}
                </h2>
                {showDate && (
                    <p className="text-muted-foreground/50">
                        {Intl.DateTimeFormat("en-US", {
                            dateStyle: "full",
                        }).format(new Date())}
                    </p>
                )}
            </div>
            {breadcrumbs && breadcrumbs?.length > 0 && (
                <div className="flex items-end gap-2 text-muted-foreground/50">
                    <Link href="/dashboard" className="capitalize hover:text-primary">
                        {t("title")}
                    </Link>
                    <span className="text-xl">/</span>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                            <Link href={breadcrumb.href} className="capitalize hover:text-primary">
                                {breadcrumb.label}
                            </Link>
                            {index !== breadcrumbs.length - 1 && (
                                <span className="text-xl">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </div >
            )}
        </div >
    );
};

export default Title