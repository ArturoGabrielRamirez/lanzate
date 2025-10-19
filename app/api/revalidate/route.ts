import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tags, paths } = body

        // Revalidar por tags si existen
        if (tags && Array.isArray(tags)) {
            tags.forEach((tag: string) => {
                revalidateTag(tag)
            })
        }

        // Revalidar por paths si existen
        if (paths && Array.isArray(paths)) {
            paths.forEach((path: string) => {
                revalidatePath(path)
            })
        }

        return NextResponse.json({
            revalidated: true,
            now: Date.now()
        })
    } catch (error) {
        console.error('Error revalidating:', error)
        return NextResponse.json(
            { error: 'Error al revalidar cache' },
            { status: 500 }
        )
    }
}