import randomstring from "randomstring"

export function generateSlug(base: string, existing?: string | null): string {
    let slug = base.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    if (existing) {
        slug = `${slug}-${randomstring.generate(6)}`
    }
    return slug
}


