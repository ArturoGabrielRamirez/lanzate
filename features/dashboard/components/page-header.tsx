"use client"

import { Fragment } from "react"

import { PageHeaderPropsFixed } from "@/features/dashboard/types"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/features/shadcn/components/breadcrumb"
import { Link } from "@/i18n/naviation"

function PageHeader({ title, subtitle, breadcrumbs, media }: PageHeaderPropsFixed) {
    const isSubtitleString = typeof subtitle === 'string'

    return (
        <header className="flex flex-col gap-1">
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
                        isSubtitleString ? (
                            <p className="text-base lg:text-lg text-muted-foreground leading-tight">
                                {subtitle}
                            </p>
                        ) : (
                            <div className="text-base lg:text-lg text-muted-foreground leading-tight">
                                {subtitle}
                            </div>
                        )
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