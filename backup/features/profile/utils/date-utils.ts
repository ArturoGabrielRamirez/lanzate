export function formatRelativeTime(date: string | Date): string {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60
    }

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds)
        if (interval >= 1) {
            return `hace ${interval} ${unit}${interval !== 1 ? (unit === 'mes' ? 'es' : 's') : ''}`
        }
    }

    return 'hace un momento'
}