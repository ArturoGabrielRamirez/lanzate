import { CUSTOMER_LEVELS, STORE_LEVELS } from '@/features/profile/constants'

export const getUserLevel = (points: number, userType: 'customer' | 'store') => {
    const levels = userType === 'store' ? STORE_LEVELS : CUSTOMER_LEVELS
    return levels.find(level => points >= level.minPoints && points <= level.maxPoints) || levels[0]
}
