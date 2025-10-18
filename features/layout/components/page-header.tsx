"use client"

import { ArrowLeft } from "lucide-react"
import { Fragment } from "react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/features/shadcn/components/breadcrumb"
import { Link, useRouter } from "@/i18n/naviation"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface PageHeaderProps {
    title: string | React.ReactNode
    subtitle?: string | React.ReactNode
    breadcrumbs?: { label: string, href: string }[]
}

function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {

    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    return (
        <header>
            <h2 className="text-2xl lg:text-4xl font-bold flex items-center gap-2">
                {title}
            </h2>
            {subtitle && (
                <p className="text-base lg:text-lg text-muted-foreground">
                    {subtitle}
                </p>
            )}
            {breadcrumbs && breadcrumbs?.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {breadcrumbs.map((breadcrumb, index) => (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={breadcrumb.href} asChild>
                                        <Link href={breadcrumb.href} className="capitalize hover:text-primary">
                                            {breadcrumb.label}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </header>
    )

    return (
        <header className="flex items-center gap-2 justify-center relative">
            <IconButton
                icon={ArrowLeft}
                className="absolute left-0"
                onClick={handleGoBack}
            />
            <h2 className="flex items-center gap-2 font-bold text-xl"> {title} </h2>
        </header>
    )
}

export { PageHeader }