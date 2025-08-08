import { Suspense } from 'react'

function ConfirmedContent() {
    const searchParams = new URLSearchParams(window.location.search)
    const type = searchParams.get('type') || 'signup'
    
    const getMessage = () => {
        switch (type) {
            case 'signup':
                return {
                    title: '¡Email confirmado!',
                    message: 'Tu cuenta ha sido activada exitosamente.',
                    action: 'Ir al dashboard',
                    href: '/dashboard'
                }
            case 'recovery':
                return {
                    title: '¡Confirmación exitosa!',
                    message: 'Ahora puedes actualizar tu contraseña.',
                    action: 'Actualizar contraseña',
                    href: '/update-password'
                }
            default:
                return {
                    title: '¡Confirmación exitosa!',
                    message: 'La operación se completó correctamente.',
                    action: 'Continuar',
                    href: '/dashboard'
                }
        }
    }
    
    const { title, message, action, href } = getMessage()
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                
                <a
                    href={href}
                    className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {action}
                </a>
            </div>
        </div>
    )
}

export default function ConfirmedPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ConfirmedContent />
        </Suspense>
    )
}