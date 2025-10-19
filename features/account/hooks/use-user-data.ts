import { useState } from "react"

import { UserType } from "@/features/account/types"

export default function useUserData(initialUser: UserType) {
    const [user, setUser] = useState(initialUser)
    const immediateData = {
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.created_at,
        activeAccounts: user.Account?.length || 0,
        storesCount: user.Store?.length || 0,
        accountType: user.Account?.[0]?.type || 'FREE'
    }

    const handleAvatarUpdate = (newAvatarUrl: string | null) => {
        setUser(prevUser => ({
            ...prevUser,
            avatar: newAvatarUrl
        }))
    }

    const handleProfileUpdate = (profile: {
        username: string | null
        firstName: string | null
        lastName: string | null
        phone: string | null
    }) => {
        setUser(prevUser => ({
            ...prevUser,
            username: profile.username,
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phone,
            updated_at: new Date()
        }))
    }

    return {
        user,
        immediateData,
        handleAvatarUpdate,
        handleProfileUpdate
    }
}