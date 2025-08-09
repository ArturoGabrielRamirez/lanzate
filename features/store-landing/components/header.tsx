import Link from "next/link"
import { Rocket, Facebook, Instagram } from "lucide-react"
/* import { createServerSideClient } from "@/utils/supabase/server" */
import CartIcon from "@/features/cart/components/cart-icon"
import { getTranslations } from "next-intl/server"
import LandingAccountDropdown from "@/features/header/components/landing-account-dropdown"
import { getUserInfo } from "@/features/layout/actions"

type Props = {
    title?: string
    socialMedia?: {
        facebook_url?: string | null
        instagram_url?: string | null
        x_url?: string | null
    } | null
    showSocialLinks?: boolean
}

async function Header({ title = "Store Name", socialMedia, showSocialLinks = true }: Props) {

    const t = await getTranslations("auth.buttons");

    /* const supabase = createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser() */
    const { payload: user } = await getUserInfo()

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

    const hasSocialMedia = socialMedia && (
        socialMedia.facebook_url ||
        socialMedia.instagram_url ||
        socialMedia.x_url
    );

    return (
        <header className="flex items-center justify-between bg-[var(--header)] text-[var(--header-foreground)] [width:var(--header-size)] m-auto [position:var(--header-floating)] left-0 right-0 [padding-top:var(--header-padding-top)] [padding-bottom:var(--header-padding-bottom)] [padding-left:var(--header-padding-left)] [padding-right:var(--header-padding-right)] [top:var(--header-top)] [border-radius:var(--header-border-radius)]">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                <Rocket className="text-primary [display:var(--show-brand-logo)]" />
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
        </header>
    )
}

export default Header