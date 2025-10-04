"use client"

import { TitleProps } from "@/features/layout/types"
import { useCurrentLocale } from "@/locales/client"
import { useTranslations } from "next-intl"
import Link from "next/link"
import React from "react"

const Title = ({ title, breadcrumbs, className, showDate, homePath }: TitleProps) => {

    const t = useTranslations("layout");
    const locale = useCurrentLocale()

    return (
        <div className={`flex flex-col gap-0 mb-2 md:mb-4 lg:mb-6 ${className}`}>
            <div className="flex items-center gap-2 justify-between">
                <h2 className='text-xl md:text-2xl xl:text-3xl text-foreground font-bold flex items-center gap-2'>
                    {title}
                </h2>
                {showDate && (
                    <>
                        <p className="text-muted-foreground/50 hidden md:block">
                            {Intl.DateTimeFormat(locale, {
                                dateStyle: "full",
                            }).format(new Date())}
                        </p>
                        <p className="text-muted-foreground/50 md:hidden">
                            {Intl.DateTimeFormat(locale, {
                                dateStyle: "short",
                            }).format(new Date())}
                        </p>
                    </>
                )}
            </div>
            {breadcrumbs && breadcrumbs?.length > 0 && (
                <div className="flex items-end gap-2 text-muted-foreground/50">
                    <Link href={homePath || "/dashboard"} className="capitalize hover:text-primary text-xs md:text-sm lg:text-base">
                        {t("title")}
                    </Link>
                    <span className="text-xs md:text-sm lg:text-xl">/</span>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                            <Link href={breadcrumb.href} className="capitalize hover:text-primary text-xs md:text-sm lg:text-base">
                                {breadcrumb.label}
                            </Link>
                            {index !== breadcrumbs.length - 1 && (
                                <span className="text-xs md:text-sm lg:text-xl">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </div >
            )}
        </div >
    );
};

export default Title