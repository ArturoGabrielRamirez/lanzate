import { Users, Heart, UserCheck, TrendingUp } from 'lucide-react'

export const generateChallenges = (followersCount: number, followingCount: number, likesCount: number, isOwnProfile: boolean) => {
    const challenges = []

    if (isOwnProfile) {
        // Retos priorizados por impacto
        if (followersCount === 0) {
            challenges.push({
                id: 'first_follower',
                title: 'Primer seguidor',
                description: 'Consigue tu primer seguidor',
                progress: 0,
                max: 1,
                reward: '+10 pts',
                icon: Users,
                color: 'text-orange-400'
            })
        } else if (followersCount < 10) {
            challenges.push({
                id: 'reach_10_followers',
                title: 'Comunidad inicial',
                description: 'Alcanza 10 seguidores',
                progress: followersCount,
                max: 10,
                reward: '+50 pts bonus',
                icon: Users,
                color: 'text-orange-400'
            })
        } else if (followersCount < 25) {
            challenges.push({
                id: 'reach_25_followers',
                title: 'Crecimiento sólido',
                description: 'Alcanza 25 seguidores',
                progress: followersCount,
                max: 25,
                reward: '+25 pts',
                icon: TrendingUp,
                color: 'text-blue-400'
            })
        }
        if (followersCount >= 5 && followingCount < followersCount * 0.3) {
            challenges.push({
                id: 'engage_community',
                title: 'Conecta más',
                description: 'Sigue a miembros de tu comunidad',
                progress: followingCount,
                max: Math.min(Math.floor(followersCount * 0.3), 15),
                reward: '+15 pts',
                icon: UserCheck,
                color: 'text-green-400'
            })
        }

        // Reto de likes (solo si no tiene muchos)
        if (likesCount < 10) {
            challenges.push({
                id: 'discover_products',
                title: 'Explorar productos',
                description: 'Dale me gusta a productos',
                progress: likesCount,
                max: 10,
                reward: '+10 pts',
                icon: Heart,
                color: 'text-pink-400'
            })
        }
    }

    return challenges.slice(0, 2) // Máximo 2 retos para sidebar estrecho
}
