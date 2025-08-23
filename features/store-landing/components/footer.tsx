import { Facebook, Instagram, Rocket } from "lucide-react"
import Link from "next/link"

type Props = {
    title?: string
    socialMedia?: {
        facebook_url?: string | null
        instagram_url?: string | null
        x_url?: string | null
    } | null
    showSocialLinks?: boolean
}

const XformerlyTwitter = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 1200 1227"
        className={className}
    >
        <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
    </svg>
);

const Footer = ({ title, socialMedia, showSocialLinks }: Props) => {
    return (
        <footer>
            <div className="container mx-auto py-4">
                <div className="grid lg:grid-cols-3 gap-2 md:gap-4 pb-4">
                    <div className="flex items-start gap-2">
                        <Rocket className="text-primary" />
                        <h3 className="text-lg font-bold">{title}</h3>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                        <Link href="/" className="text-muted-foreground hover:text-primary block duration-150 text-center">
                            <span>Inicio</span>
                        </Link>
                        <Link href="/account" className="text-muted-foreground hover:text-primary block duration-150 text-center">
                            <span>Mi cuenta</span>
                        </Link>
                        <Link href="/cart" className="text-muted-foreground hover:text-primary block duration-150 text-center">
                            <span>Carrito</span>
                        </Link>
                    </div>
                    <div className="flex gap-2 items-end justify-start flex-col">
                        <p className="text-muted-foreground text-center">Seguinos en </p>
                        <div className="flex items-center gap-2">
                            {showSocialLinks && socialMedia && (
                                <>
                                    {socialMedia.facebook_url && (
                                        <a
                                            href={socialMedia.facebook_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:text-primary transition-colors"
                                            aria-label="Facebook"
                                        >
                                            <Facebook className="size-5" />
                                        </a>
                                    )}
                                    {socialMedia.instagram_url && (
                                        <a
                                            href={socialMedia.instagram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:text-primary transition-colors"
                                            aria-label="Instagram"
                                        >
                                            <Instagram className="size-5" />
                                        </a>
                                    )}
                                    {socialMedia.x_url && (
                                        <a
                                            href={socialMedia.x_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:text-primary transition-colors"
                                            aria-label="X (Twitter)"
                                        >
                                            <XformerlyTwitter className="size-5 fill-current" />
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 border-t border-foreground/10 pt-4">
                    <p className="text-sm text-foreground/50">
                        Copyright &copy; {new Date().getFullYear()} - Lanzate
                    </p>
                </div>
            </div>
        </footer>
    )
}
export default Footer