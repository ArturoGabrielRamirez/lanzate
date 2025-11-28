'use server'

import { getCurrentUserData, getSignOutData } from '@/features/auth/data'
import { actionWrapper } from '@/features/global/utils'

export async function handleSignOut() {
    return actionWrapper(async () => {

        const { user: userData } = await getCurrentUserData()

        if (userData) {
            const error = await getSignOutData()

            if (error) {
                throw new Error(error.message)
            }
        }

        return {
            hasError: false,
            payload: null,
            message: 'Se cerró sesión correctamente'
        }
    })
}