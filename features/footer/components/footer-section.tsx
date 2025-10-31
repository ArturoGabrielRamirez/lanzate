'use client'

import Link from 'next/link'

import { IconButton } from '@/features/shadcn/components/shadcn-io/icon-button'

const links = [
    {
        title: 'Terms and Conditions',
        href: '/terms-and-conditions',
    },
    {
        title: 'Privacy Policy',
        href: '/privacy-policy',
    },
    {
        title: 'Cookie Policy',
        href: '/cookies',
    },
    {
        title: 'Contact Us',
        href: '/contact-us',
    },
]

function FooterSection() {
    return (
        <footer className="pt-16 pb-24 md:py-16 mx-auto container z-10 relative">
            <div className="mx-auto max-w-5xl">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-primary mx-auto size-fit" id="welcome">
                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><g fill="none" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m1 18.127l11 3m0 0l11-3m-22 0l5.493-1.439m-5.493 6v-4.436m22 0v4.436m-11 .5v-2.061m3.5-15.065c0 1.933-.583 7-3.5 7S8.5 8 8.5 6.062c0-3.5 3.5-5.25 3.5-5.25s3.5 1.75 3.5 5.25"></path><path d="M12 5.937a.5.5 0 0 1 0-1m0 1a.5.5 0 0 0 0-1"></path><path strokeLinecap="round" strokeLinejoin="round" d="M10.01 17.881v-1.008a2.017 2.017 0 0 1 3.99.08v.928m-4.317-5.72l-.808.405a5.3 5.3 0 0 0-1.242.916a.653.653 0 0 1-1.13-.417a3.49 3.49 0 0 1 2.113-3.61m5.701 2.706l.808.405c.457.243.875.551 1.242.916a.654.654 0 0 0 1.13-.417a3.49 3.49 0 0 0-2.113-3.61M23 18.127l-5.493-1.439" className="size-5 xl:size-6"></path></g></svg>
                    <h1 className="text-xl md:text-2xl xl:text-3xl">Lanzate</h1>
                </Link>

                <div className="my-4 md:my-8 flex flex-wrap justify-center gap-6 [row-gap:0.75rem] text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <div className="my-4 md:my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X/Twitter"
                        className="text-muted-foreground hover:text-primary block">
                        <IconButton icon={
                            () =>
                                <svg
                                    className="size-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path>
                                </svg>
                        }>
                        </IconButton>
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="text-muted-foreground hover:text-primary block">
                        <IconButton icon={
                            () => <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
                            </svg>
                        }>
                        </IconButton>

                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-muted-foreground hover:text-primary block">
                        <IconButton icon={
                            () => <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                            </svg>
                        }></IconButton>

                    </Link>

                </div>
                <span className="text-muted-foreground block text-center text-sm"> © {new Date().getFullYear()} Lanzate, All rights reserved</span>
            </div>
        </footer>
    )
}

export { FooterSection }