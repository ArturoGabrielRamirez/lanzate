import { UserX, Home, Search } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/features/shadcn/components/ui/button'

function UserNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Contenedor principal con efecto glassmorphism */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8 md:p-12">
          {/* Icono con efecto glow */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full w-32 h-32 mx-auto flex items-center justify-center border border-orange-500/20">
              <UserX className="w-16 h-16 text-orange-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* Texto principal */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              404
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-4">
              Usuario no encontrado
            </h2>
            <p className="text-gray-400 leading-relaxed">
              El perfil que buscás no existe o no está disponible públicamente.
              Verificá que el nombre de usuario esté escrito correctamente.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg shadow-orange-500/25 transition-all duration-200"
              size="lg"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-200 border-gray-600 hover:border-gray-500 transition-all duration-200"
              size="lg"
            >
              <Link href="/explore">
                <Search className="w-4 h-4 mr-2" />
                Explorar usuarios
              </Link>
            </Button>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-sm text-gray-500 text-center">
              ¿Necesitas ayuda? Contacta con el {' '}
              <Link href="/support" className="text-orange-400 hover:text-orange-300 underline transition-colors">
                soporte técnico
              </Link>
            </p>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}

export { UserNotFound }