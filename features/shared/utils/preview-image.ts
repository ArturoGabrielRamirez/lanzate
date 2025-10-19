/* export class PreviewManager {
    private activeUrls = new Set<string>()

    createPreview(file: File): string {
        const url = URL.createObjectURL(file)
        this.activeUrls.add(url)
        return url
    }

    revokePreview(url: string | null): void {
        if (url && this.activeUrls.has(url)) {
            URL.revokeObjectURL(url)
            this.activeUrls.delete(url)
        }
    }

    revokeAll(): void {
        this.activeUrls.forEach(url => URL.revokeObjectURL(url))
        this.activeUrls.clear()
    }
} */