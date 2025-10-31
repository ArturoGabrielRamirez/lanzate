export function navigateToProduct(storeSlug: string, productSlug: string) {
    window.open(`/stores/${storeSlug}/products/${productSlug}`, '_blank')
}