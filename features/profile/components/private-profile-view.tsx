import { Lock, UserPlus } from 'lucide-react'

import { PrivateProfileViewProps } from '@/features/profile/types'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function PrivateProfileView({ reason, currentUser, isUserLoading }: PrivateProfileViewProps) {
    return (
        <div className="px-4 md:px-6 pt-4">
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Perfil Privado</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                        {reason}. Solo el propietario puede ver el contenido de este perfil.
                    </p>

                    {currentUser && !isUserLoading && (
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full max-w-xs" disabled>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Solicitar seguimiento
                            </Button>
                            <p className="text-xs text-gray-500">
                                Las solicitudes de seguimiento estarán disponibles próximamente
                            </p>
                        </div>
                    )}

                    {!currentUser && !isUserLoading && (
                        <p className="text-sm text-gray-500">
                            Iniciá sesión para poder solicitar seguir este perfil
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export { PrivateProfileView }