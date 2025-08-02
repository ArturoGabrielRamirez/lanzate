'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { handleGoogleLogIn } from '../actions/handleGoogleLogIn'
import { handleFacebookLogin } from '../actions/handleFacebookLogin'
import Facebook from './facebook-logo'
import Google from './google-logo'

interface GoogleLoginButtonProps {
    orLoginWith: string
}

export function SocialLoginButtons({ orLoginWith }: GoogleLoginButtonProps) {
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
                        <Google className='size-6' />
                        Google
                    </Button>
                </form>
                <form action={handleFacebookLogin}>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        <Facebook className='size-6' />
                        Facebook
                    </Button>
                </form>
            </div>
        </div>
    )
}