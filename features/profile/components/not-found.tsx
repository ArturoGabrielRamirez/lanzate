import Link from 'next/link'
import { UserX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <UserX className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Usuario no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El perfil que buscas no existe o no está disponible públicamente.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          
          <p className="text-sm text-gray-500">
            ¿Crees que esto es un error? Verifica que el nombre de usuario esté escrito correctamente.
          </p>
        </div>
      </div>
    </div>
  )
}