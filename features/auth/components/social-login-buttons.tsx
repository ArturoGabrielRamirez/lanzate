'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { handleFacebookLogin, handleGoogleLogIn } from '@/features/auth/actions'
import { FacebookLogo, GoogleLogo } from '@/features/auth/components'

interface GoogleLoginButtonProps {
    orLoginWith: string
}

const SocialLoginButtons = ({ orLoginWith }: GoogleLoginButtonProps) => {
    return (
        <div className="grid w-full place-content-left lg:pl-10">
            <Label htmlFor='google' className='justify-center w-full mb-2 text-center'>
                {orLoginWith}
            </Label>
            <div className='flex flex-col gap-2 w-full'>
                <form action={handleGoogleLogIn}>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        <GoogleLogo className='size-6' />
                        Google
                    </Button>
                </form>
                <form action={handleFacebookLogin}>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        <FacebookLogo className='size-6' />
                        Facebook
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SocialLoginButtons;