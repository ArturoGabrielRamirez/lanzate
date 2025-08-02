'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { handleGoogleLogIn } from '../actions/handleGoogleLogIn'
import { handleFacebookLogin } from '../actions/handleFacebookLogin'


interface GoogleLoginButtonProps {
    orLoginWith: string
}

export function GoogleLoginButton({ orLoginWith }: GoogleLoginButtonProps) {
    return (
        <div className="grid w-full place-content-left lg:pl-10">
            <Label htmlFor='google' className='justify-center w-full mb-2 text-center'>
                {orLoginWith}
            </Label>
            <>
                <form action={handleGoogleLogIn}>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Google
                    </Button>
                </form>
                <form action={handleFacebookLogin}>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Facebook
                    </Button>
                </form>
            </>
        </div>
    )
}