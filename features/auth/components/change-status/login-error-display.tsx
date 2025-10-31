'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { LoginErrorDisplayProps } from '@/features/auth/types'

function LoginErrorDisplay({ error, message }: LoginErrorDisplayProps) {
    const t = useTranslations("auth")
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (error && message) {
            setIsVisible(true)
            if (window.location.hash) {
                const newUrl = window.location.pathname + window.location.search
                window.history.replaceState({}, '', newUrl)
            }
        }
    }, [error, message])

    if (!isVisible || !error || !message) {
        return null
    }

    const handleClose = () => {
        setIsVisible(false)
        const params = new URLSearchParams(searchParams.toString())
        params.delete('error')
        params.delete('message')

        const newUrl = params.toString() ? `?${params.toString()}` : ''
        router.replace(`/login${newUrl}`, { scroll: false })
    }

    const getErrorTitle = (errorType: string) => {
        switch (errorType) {
            case 'cancelled':
                return t("errors.oauth.cancelled.title")
            case 'oauth_failed':
                return t("errors.oauth.failed.title")
            case 'temporary':
                return t("errors.oauth.temporary.title")
            case 'invalid':
                return t("errors.oauth.invalid.title")
            case 'unexpected':
                return t("errors.oauth.unexpected.title")
            default:
                return t("errors.oauth.generic.title")
        }
    }

    const getErrorDescription = (errorType: string) => {
        switch (errorType) {
            case 'cancelled':
                return t("errors.oauth.cancelled.description")
            case 'oauth_failed':
                return t("errors.oauth.failed.description")
            case 'temporary':
                return t("errors.oauth.temporary.description")
            default:
                return t("errors.oauth.generic.description")
        }
    }

    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">
                        {getErrorTitle(error)}
                    </h4>
                    <p className="text-sm">
                        {getErrorDescription(error)}
                    </p>
                    {message && error !== 'cancelled' && !message.includes('Se canceló') && (
                        <p className="text-xs mt-1 opacity-75">
                            {decodeURIComponent(message)}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="ml-4 text-red-400 hover:text-red-600 text-lg leading-none"
                    aria-label={t("close")}
                >
                    ×
                </button>
            </div>
            {error === 'cancelled' && (
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={handleClose}
                        className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-700"
                    >
                        {t("try-facebook-again")}
                    </button>
                </div>
            )}
        </div>
    )
}

export { LoginErrorDisplay };