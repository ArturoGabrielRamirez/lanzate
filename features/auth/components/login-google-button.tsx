'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'


interface GoogleLoginButtonProps {
    orLoginWith: string
}

export function GoogleLoginButton({ orLoginWith }: GoogleLoginButtonProps) {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) {
                console.error('Error:', error.message)
            }
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <div className="grid w-full place-content-left lg:pl-10">
            <Label htmlFor='google' className='justify-center w-full mb-2 text-center'>
                {orLoginWith}
            </Label>
            <Button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full"
            >
                Google
            </Button>
        </div>
    )
}