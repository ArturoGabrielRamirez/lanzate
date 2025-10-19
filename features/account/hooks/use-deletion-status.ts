"use client"

import { useEffect, useState } from "react"

import { UserDeletionStatus } from "@/features/account/types"

export default function useDeletionStatus() {
    const [deletionStatus, setDeletionStatus] = useState<UserDeletionStatus>({
        isDeletionRequested: false,
        deletionRequestedAt: null,
        deletionScheduledAt: null,
        displayScheduledAt: null,
        deletionReason: null,
        canCancel: false,
        daysRemaining: 0,
        minutesRemaining: 0,
        canDeleteUntil: null,
        canCancelUntil: null,
        isWithinActionWindow: false,
        isAnonymized: false,
        legalStatus: 'active',
    })
    const [isDeletionLoading, setIsDeletionLoading] = useState(true)
    const [hasInitialized, setHasInitialized] = useState(false)

    const fetchDeletionStatus = async () => {
        try {
            const response = await fetch('/api/user/deletion-status')
            if (response.ok) {
                const status = await response.json()
                setDeletionStatus(status)
            }
        } catch (error) {
            console.error('Error fetching deletion status:', error)
        } finally {
            setIsDeletionLoading(false)
        }
    }

    useEffect(() => {
        if (!hasInitialized) {
            const timer = setTimeout(() => {
                fetchDeletionStatus()
                setHasInitialized(true)
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [hasInitialized])

    return {
        deletionStatus,
        isDeletionLoading,
        fetchDeletionStatus,
        hasInitialized
    }
}