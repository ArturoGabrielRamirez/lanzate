import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { handleFacebookLogin, handleGoogleLogIn } from '@/features/auth/actions'
import { FacebookLogo, GoogleLogo } from '@/features/auth/components'

async function SocialLoginButtons() {

    const t = await getTranslations("auth")

    return (
        <div className="grid w-full place-content-left max-w-xl">
            <Label htmlFor='google' className='justify-center w-full mb-2 text-center'>
                {t("description.or-login-with")}
            </Label>
            <div className='flex flex-col gap-2 w-full'>
                <form action={handleGoogleLogIn}>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-t from-chart-5 to-primary"
                    >
                        <GoogleLogo className='size-6' />
                        Google
                    </Button>
                </form>
                <form action={handleFacebookLogin}>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-t from-chart-5 to-primary"
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