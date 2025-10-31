import { Rocket, Facebook, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import CartIcon from "@/features/cart/components/cart-icon"
import { getUserInfo } from "@/features/global/actions"
import { LandingAccountDropdown } from "@/features/header/components"
import { XformerlyTwitter } from "@/features/layout/components/public-store/x-formerly-twitter"
import { HeaderProps } from "@/features/layout/types/types"

async function Header({ title = "Store Name", socialMedia, showSocialLinks = true, logo }: HeaderProps) {

    const t = await getTranslations("auth.buttons");

    const { payload: user } = await getUserInfo()


    const hasSocialMedia = socialMedia && (
        socialMedia.facebook_url ||
        socialMedia.instagram_url ||
        socialMedia.x_url
    );

    return (
        <div className="container mx-auto flex items-center justify-between ">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                {logo ? (
                    <Image src={logo} alt={title} width={32} height={32} />
                ) : (
                    <Rocket className="text-primary [display:var(--show-brand-logo)]" />
                )}
                <h1 className="[display:var(--show-brand-text)]">{title}</h1>
            </Link>
            <div className="flex items-center gap-2">
                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>{t("login")}</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>{t("sign-up")}</Link>}
                <CartIcon />
                {user && <LandingAccountDropdown />}

                {showSocialLinks && hasSocialMedia && (
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
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
                    </div>
                )}
            </div>
        </div>
    )

}

export { Header }