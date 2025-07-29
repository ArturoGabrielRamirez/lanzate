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
            // CORRECCIÓN: Usar siempre el dominio principal para el callback
            const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'
            const protocol = window.location.protocol
            const callbackUrl = `${protocol}//${rootDomain}/auth/callback`
            
            // Guardar el origin actual para redirección posterior
            const currentOrigin = window.location.origin
            const currentPath = window.location.pathname
            
            console.log('Google login initiated:', { 
                callbackUrl, 
                currentOrigin, 
                currentPath 
            })

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: callbackUrl,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                        // Pasar información sobre dónde redirigir después
                        state: btoa(JSON.stringify({ 
                            origin: currentOrigin,
                            returnPath: currentPath 
                        }))
                    },
                },
            })

            if (error) {
                console.error('Google login error:', error.message)
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