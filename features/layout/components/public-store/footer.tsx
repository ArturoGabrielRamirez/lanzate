import { Facebook, Instagram, Rocket } from "lucide-react"
import Link from "next/link"

import { XformerlyTwitter } from "@/features/layout/components/public-store/x-formerly-twitter"
import { FooterProps } from "@/features/layout/types/types"

function Footer({ title, socialMedia, showSocialLinks }: FooterProps) {
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
                        <Link href="/my-orders" className="text-muted-foreground hover:text-primary block duration-150 text-center">
                            <span>Mis pedidos</span>
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
export { Footer }