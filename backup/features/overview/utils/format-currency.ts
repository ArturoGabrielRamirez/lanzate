export function formatCurrency(amount: number, locale: string = "es-AR", currency: string = "ARS") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    }).format(amount)
}


