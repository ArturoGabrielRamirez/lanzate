export async function revalidateCache(options: {
    tags?: string[]
    paths?: string[]
}): Promise<boolean> {
    try {
        const response = await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
        })

        if (!response.ok) {
            throw new Error(`Revalidation failed: ${response.statusText}`)
        }

        return true
    } catch (error) {
        console.warn('Error invalidating cache:', error)
        return false
    }
}