
import { CheckCircle } from 'lucide-react';
import React from 'react'

import { SectionSubtitle, SmallMutedText } from '@/features/landing/components';
import { Button } from '@/features/shadcn/components/button';
import { Link } from '@/i18n/naviation';
import { cn } from '@/lib/utils'

export function PriceCard({ className, contactPageHref, actionText= "Get Started", children }: { className?: string, contactPageHref: string, actionText?: string, children: React.ReactNode }) {
    return (
        <article
            className={cn(
                'text-start border backdrop-blur-[4px] h-full min-h-[500px] w-full max-w-[400px]  dark:border-neutral-800 border-neutral-300 px-6 py-6 rounded-xl relative z-[1] flex flex-col justify-between bg-card/30 hover:bg-card/100 transition-all',
                className
            )}
        >
            <span>{children}</span>
            <Button asChild variant="outline">
                <Link href={contactPageHref} className={'w-full flex items-center justify-center mt-20 '}>
                    {actionText}
                </Link>
            </Button>
        </article>
    )
}

export function OfferingWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
    return <ul className={cn('mt-10 flex flex-col gap-3 text-sm', className)}>{children}</ul>
}

export function Offering({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <li className={cn('flex gap-2 items-center font-medium', className)}>
            <CheckCircle className='size-6 text-primary' />
            <div>{children}</div>
        </li>
    )
}
export function ProductName({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h1 className={cn('text-lg font-bold text-primary text-start', className)}>{children}</h1>
}

export function Price({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('mt-10 mb-7', className)}>
            <div className={'flex items-end gap-1 p-0'}>
                <SectionSubtitle>{children}</SectionSubtitle>
            </div>
        </div>
    )
}
export function Description({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('h-20 text-muted-foreground', className)}>
            <SmallMutedText>{children}</SmallMutedText>
        </div>
    )
}
