"use client"

import { Fragment } from "react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shadcn/components/breadcrumb"
import { Link } from "@/i18n/naviation"

interface PageHeaderProps {
    title: string | React.ReactNode
    subtitle?: string | React.ReactNode
    breadcrumbs?: { label: string, href: string }[]
    media?: React.ReactNode | string
}

function PageHeader({ title, subtitle, breadcrumbs, media }: PageHeaderProps) {

    return (
        <header className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                {media && media}
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl lg:text-4xl font-bold flex items-center gap-2">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-base lg:text-lg text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
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
}

export { PageHeader }