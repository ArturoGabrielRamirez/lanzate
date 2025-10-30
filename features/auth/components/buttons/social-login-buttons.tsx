import { getTranslations } from 'next-intl/server'

import { handleFacebookLoginAction, handleGoogleLogInAction } from '@/features/auth/actions'
import { FacebookLogo, GoogleLogo } from '@/features/auth/components'
import { Button } from '@/features/shadcn/components/button'
import { Label } from '@/features/shadcn/components/ui/label'

async function SocialLoginButtons() {

    const t = await getTranslations("auth")

    return (
        <div className="grid w-full place-content-left max-w-xl">
            <Label htmlFor='google' className='justify-center w-full mb-2 text-center'>
                {t("description.or-login-with")}
            </Label>
            <div className='flex flex-col gap-2 w-full'>
                <form action={handleGoogleLogInAction}>
                    <Button
                        type="submit"
                        className="w-full"
                        size={"lg"}
                        disabled
                    >
                        <GoogleLogo className='size-6' />
                        Google
                    </Button>
                </form>
                <form action={handleFacebookLoginAction}>
                    <Button
                        type="submit"
                        className="w-full"
                        size={"lg"}
                        disabled
                    >
                        <FacebookLogo className='size-6' />
                        Facebook
                    </Button>
                </form>
            </div>
        </div>
    )
}

export { SocialLoginButtons };