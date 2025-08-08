// /app/auth/error/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function ErrorContent() {
    const searchParams = useSearchParams()
    const [errorMessage, setErrorMessage] = useState('')
    
    useEffect(() => {
        const message = searchParams?.get('message') || 'unknown'
        
        const errorMessages: Record<string, string> = {
            'expired': 'El enlace de confirmación ha expirado. Solicita uno nuevo.',
            'invalid': 'El enlace de confirmación no es válido.',
            'missing_parameters': 'Faltan parámetros en el enlace de confirmación.',
            'unknown': 'Ocurrió un error desconocido durante la confirmación.'
        }
        
        setErrorMessage(errorMessages[message] || errorMessages.unknown)
    }, [searchParams])
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Error de confirmación
                </h1>
                
                <p className="text-gray-600 mb-6">
                    {errorMessage}
                </p>
                
                <div className="space-y-3">
                    <a
                        href="/login"
                        className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ir a iniciar sesión
                    </a>
                    
                    <a
                        href="/signup"
                        className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Crear nueva cuenta
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div>Cargando...</div>
            </div>
        }>
            <ErrorContent />
        </Suspense>
    )
}