"use client"

import { Fragment } from "react"

import { PageHeaderProps } from "@/features/dashboard/types"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shadcn/components/breadcrumb"
import { Link } from "@/i18n/naviation"


function PageHeader({ title, subtitle, breadcrumbs, media }: PageHeaderProps) {

    return (
        <header className="flex flex-col gap-1 border-b border-muted-foreground/15 pb-2">
            <div className="flex items-center gap-2">
                {media && (
                    <div className="relative bottom-1">
                        {media}
                    </div>
                )}
                <div>
                    <h2 className="text-2xl lg:text-4xl font-bold flex items-center gap-2 leading-none">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-base lg:text-lg text-muted-foreground leading-tight">
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